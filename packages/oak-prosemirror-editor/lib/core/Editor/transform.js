
/**
  THESE TWO FUNCTIONS ARE REPLACEMENTS
  FOR THE PROSEMIRROR-COMMAND TOGGLEMARK
  FUNCTION WHICH DID NOT SUPPORT THE CHANGE OF MARK ATTRIBUTE
 */

const markApplies = (doc, ranges, type) => {
  for (let i = 0; i < ranges.length; i++) {
    const { $from, $to } = ranges[i];
    let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, node => {
      if (can) return false;
      can = node.inlineContent && node.type.allowsMarkType(type);
    });
    if (can) return true;
  }

  return false;
};

export const toggleMark = (markType, attrs) => {
  return function (state, dispatch) {
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

        for (let i = 0; !has && i < ranges.length; i++) {
          const { $from, $to } = ranges[i];
          has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
        }

        for (let i = 0; i < ranges.length; i++) {
          const { $from, $to } = ranges[i];

          let from = $from.pos;
          let to = $to.pos;
          const start = $from.nodeAfter;
          const end = $to.nodeBefore;
          const spaceStart = start && start.isText
            ? /^\s*/.exec(start.text)[0].length : 0;
          const spaceEnd = end && end.isText
            ? /\s*$/.exec(end.text)[0].length : 0;

          if (from + spaceStart < to) { from += spaceStart; to -= spaceEnd; }

          tr.addMark(from, to, markType.create(attrs));
        }

        dispatch(tr.scrollIntoView());
      }
    }

    return true;
  };
};
