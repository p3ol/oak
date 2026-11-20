import type { Editor, ModelPosition } from 'ckeditor5';

import type { FieldSelection } from './types';
import type { FieldCursorRect } from './Cursors';
import { getPosition } from './selection';

/**
 * Measures where a selection (offsets, see `getOffset`) is displayed in the
 * editor, relative to `container`, limited to the editable's visible area
 */
export const measureSelection = (
  editor: Editor,
  container: HTMLElement,
  { anchor, head }: FieldSelection,
): { caret: FieldCursorRect | null; selection: FieldCursorRect[] } => {
  const { model, editing } = editor;
  const editable = editing.view.getDomRoot();

  if (!editable) {
    return { caret: null, selection: [] };
  }

  const origin = container.getBoundingClientRect();
  const box = editable.getBoundingClientRect();

  // Positions between elements can't be displayed
  const toPosition = (offset: number) => model.schema
    .getNearestSelectionRange(getPosition(editor, offset))?.start;

  const relative = (r: DOMRect | DOMRectReadOnly, width = r.width) => ({
    top: r.top - origin.top,
    left: r.left - origin.left,
    width,
    height: r.height,
  });

  const isVisible = (r: DOMRect | DOMRectReadOnly) =>
    r.bottom > box.top && r.top < box.bottom;

  const toDomRange = (start: ModelPosition, end: ModelPosition) => {
    const viewRange = editing.mapper.toViewRange(model.createRange(start, end));

    return editing.view.domConverter.viewRangeToDom(viewRange);
  };

  let caret: FieldCursorRect | null = null;
  let selection: FieldCursorRect[] = [];

  try {
    const position = toPosition(head);

    if (position) {
      const range = toDomRange(position, position);
      let rect: DOMRect | undefined = range.getClientRects()[0];

      // Empty lines have no text to measure
      if (!rect || !rect.height) {
        const node = range.startContainer;
        rect = (node.nodeType === 1 ? node as Element : node.parentElement)
          ?.getBoundingClientRect();
      }

      if (rect && isVisible(rect)) {
        caret = relative(rect, 0);
      }
    }

    if (anchor !== head) {
      const start = toPosition(Math.min(anchor, head));
      const end = toPosition(Math.max(anchor, head));

      if (start && end) {
        selection = Array.from(toDomRange(start, end).getClientRects())
          .filter(r => r.width > 0 && isVisible(r))
          .map(r => relative(r));
      }
    }
  } catch {
    // Positions not displayed (yet)
  }

  return { caret, selection };
};
