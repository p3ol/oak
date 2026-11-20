import type { EditorView } from '@remirror/pm/view';

import type { FieldSelection } from './types';
import type { FieldCursorRect } from './Cursors';

/**
 * Measures where a selection (ProseMirror positions) is displayed in the
 * editor, relative to `container`
 */
export const measureSelection = (
  view: EditorView,
  container: HTMLElement,
  { anchor, head }: FieldSelection,
): { caret: FieldCursorRect | null; selection: FieldCursorRect[] } => {
  const size = view.state.doc.content.size;
  const clamp = (position: number) => Math.max(0, Math.min(position, size));
  const origin = container.getBoundingClientRect();
  const from = clamp(Math.min(anchor, head));
  const to = clamp(Math.max(anchor, head));
  let caret: FieldCursorRect | null = null;
  let selection: FieldCursorRect[] = [];

  try {
    const coords = view.coordsAtPos(clamp(head));
    caret = {
      top: coords.top - origin.top,
      left: coords.left - origin.left,
      width: 0,
      height: coords.bottom - coords.top,
    };
  } catch {
    // Position not displayed (yet)
  }

  if (from !== to) {
    try {
      const start = view.domAtPos(from);
      const end = view.domAtPos(to);
      const range = view.dom.ownerDocument.createRange();
      range.setStart(start.node, start.offset);
      range.setEnd(end.node, end.offset);
      selection = Array.from(range.getClientRects())
        .filter(r => r.width > 0)
        .map(r => ({
          top: r.top - origin.top,
          left: r.left - origin.left,
          width: r.width,
          height: r.height,
        }));
    } catch {
      // Same
    }
  }

  return { caret, selection };
};
