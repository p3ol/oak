import { type LexicalEditor, $getNodeByKey } from 'lexical';
import { createDOMRange, createRectsFromDOMRange } from '@lexical/selection';

import type { FieldSelection } from './types';
import type { FieldCursorRect } from './Cursors';
import { $getPointAt } from './positions';

/**
 * Measures where a selection (offsets, see `positions.ts`) is displayed in
 * the editor, relative to `container`
 */
export const measureSelection = (
  editor: LexicalEditor,
  container: HTMLElement,
  { anchor, head }: FieldSelection,
): { caret: FieldCursorRect | null; selection: FieldCursorRect[] } => {
  const origin = container.getBoundingClientRect();
  const relative = (r: DOMRect, width = r.width): FieldCursorRect => ({
    top: r.top - origin.top,
    left: r.left - origin.left,
    width,
    height: r.height,
  });

  return editor.read(() => {
    let caret: FieldCursorRect | null = null;
    let selection: FieldCursorRect[] = [];

    try {
      const h = $getPointAt(head);
      const headNode = $getNodeByKey(h.key);

      if (headNode) {
        const range = createDOMRange(
          editor, headNode, h.offset, headNode, h.offset
        );
        let rect = range?.getClientRects()[0];

        // Empty lines have no text to measure
        if (!rect || !rect.height) {
          rect = editor.getElementByKey(h.key)?.getBoundingClientRect();
        }

        if (rect) {
          caret = relative(rect, 0);
        }
      }

      if (anchor !== head) {
        const a = $getPointAt(anchor);
        const anchorNode = $getNodeByKey(a.key);

        if (anchorNode && headNode) {
          const range = createDOMRange(
            editor, anchorNode, a.offset, headNode, h.offset
          );

          if (range) {
            selection = createRectsFromDOMRange(editor, range)
              .filter(r => r.width > 0)
              .map(r => relative(r));
          }
        }
      }
    } catch {
      // Positions not displayed (yet)
    }

    return { caret, selection };
  });
};
