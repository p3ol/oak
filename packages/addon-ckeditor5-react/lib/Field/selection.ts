import type { Editor, ModelPosition } from 'ckeditor5';

/*
 * CKEditor's `data.set()` replaces the whole document and moves the selection
 * to its start. To keep the selection when the content is changed from
 * outside (e.g. by another user), it is saved as offsets in a linear
 * representation of the document (one character per text character & element
 * boundary), mapped onto the new document, then restored.
 */

const ELEMENT_START = '\u0001';
const ELEMENT_END = '\u0002';

const walk = (editor: Editor, end?: ModelPosition) => {
  const { model } = editor;
  const root = model.document.getRoot()!;
  const range = end
    ? model.createRange(model.createPositionAt(root, 0), end)
    : model.createRangeIn(root);

  return range.getWalker({ singleCharacters: true });
};

/** Linear representation of the document */
export const serializeModel = (editor: Editor) => {
  let text = '';

  for (const { type, item } of walk(editor)) {
    text += type === 'text'
      ? (item as any).data
      : type === 'elementStart' ? ELEMENT_START : ELEMENT_END;
  }

  return text;
};

export const getOffset = (editor: Editor, position: ModelPosition) => {
  let offset = 0;

  for (const _ of walk(editor, position)) { // eslint-disable-line
    offset++;
  }

  return offset;
};

export const getPosition = (editor: Editor, offset: number) => {
  const { model } = editor;
  let position = model.createPositionAt(model.document.getRoot()!, 0);
  let i = 0;

  for (const value of walk(editor)) {
    if (i++ >= offset) {
      break;
    }

    position = value.nextPosition;
  }

  return position;
};

export declare interface SavedSelection {
  text: string;
  start: number;
  end: number;
  backward: boolean;
}

export const saveSelection = (editor: Editor): SavedSelection | null => {
  const selection = editor.model.document.selection;
  const range = selection.getFirstRange();

  if (!range) {
    return null;
  }

  return {
    text: serializeModel(editor),
    start: getOffset(editor, range.start),
    end: getOffset(editor, range.end),
    backward: selection.isBackward,
  };
};

/**
 * Where a position ends up when `a` is changed into `b` (a single contiguous
 * change between the common prefix & suffix)
 */
export const mapPosition = (position: number, a: string, b: string) => {
  let start = 0;
  const max = Math.min(a.length, b.length);

  while (start < max && a[start] === b[start]) {
    start++;
  }

  let endA = a.length;
  let endB = b.length;

  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }

  if (position <= start) {
    return position;
  }

  if (position >= endA) {
    return position + endB - endA;
  }

  return endB;
};

export const restoreSelection = (editor: Editor, saved: SavedSelection) => {
  const { model } = editor;
  const text = serializeModel(editor);

  // Positions between elements can't hold a selection
  const getSelectionPosition = (offset: number) => model.schema
    .getNearestSelectionRange(
      getPosition(editor, mapPosition(offset, saved.text, text))
    )?.start;

  try {
    const start = getSelectionPosition(saved.start);
    const end = saved.end === saved.start
      ? start
      : getSelectionPosition(saved.end);

    if (start && end) {
      model.change(writer => {
        writer.setSelection(model.createRange(start, end), {
          backward: saved.backward,
        });
      });
    }
  } catch {
    // The selection can't always be mapped (e.g. its element was removed)
  }
};
