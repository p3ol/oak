import { schema } from './schema';

/**
  These three first functions are replacements
  for the prosemirror-command togglemark
  function which did not support the change of mark attribute
 */

const markApplies = (doc, ranges, type) => {
  for (const { $from, $to } of ranges) {
    let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, node => {
      if (can) return false;
      can = node.inlineContent && node.type.allowsMarkType(type);
    });
    if (can) return true;
  }

  return false;
};

const isDefault = (markAttrs, defaultAttrs) => {
  for (const attr in defaultAttrs) {
    if (markAttrs[attr] !== defaultAttrs[attr].default) return false;
  }

  return true;
};

export const toggleMark = (markType, attrs) => {
  return (state, dispatch) => {
    const { empty, $cursor, ranges } = state.selection;

    if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) {
      return false;
    }

    if (dispatch) {
      if ($cursor) {
        if (markType.isInSet(state.storedMarks || $cursor.marks())) {
          dispatch(state.tr.removeStoredMark(markType));
        } else {
          dispatch(state.tr.addStoredMark(markType.create(attrs)));
        }
      } else {
        let has = false; const tr = state.tr;

        for (const { $from, $to } of ranges) {
          has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
        }

        for (let i = 0; i < ranges.length; i++) {
          const { $from, $to } = ranges[i];

          if (
            has && (
              Object.keys(markType.attrs).length === 0 ||
              isDefault(attrs, markType.attrs)
            )
          ) {
            tr.removeMark($from.pos, $to.pos, markType);
          } else {
            let from = $from.pos;
            let to = $to.pos;
            const start = $from.nodeAfter;
            const end = $to.nodeBefore;
            const spaceStart = start && start.isText
              ? /^\s*/.exec(start.text)[0].length : 0;
            const spaceEnd = end && end.isText
              ? /\s*$/.exec(end.text)[0].length : 0;

            if (from + spaceStart < to) {
              from += spaceStart;
              to -= spaceEnd;
            }

            tr.addMark(from, to, markType.create(attrs));
          }
        }

        dispatch(tr.scrollIntoView());
      }
    }

    return true;
  };
};

export const removeActiveMark = markType =>
  (state, dispatch) => {
    const tr = state.tr;
    const { from, to } = state.selection;
    state.doc.nodesBetween(from, to, (node, pos) => {

      if (markType.isInSet(node.marks)) {
        tr.removeMark(
          pos,
          pos + Math.max(node.textContent.length, 1), markType
        );
      }
    });
    dispatch(tr.scrollIntoView());
  };

export const updateActiveLink = (attrs = {}) => {
  return (state, dispatch) => {
    const tr = state.tr;
    const { $cursor } = state.selection;
    const activeLink = schema.marks.link.isInSet(
      state.storedMarks || $cursor.marks()
    );

    if (activeLink) {
      activeLink.attrs = attrs;
    }

    dispatch(tr.scrollIntoView());
  };
};
