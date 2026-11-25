import type { FieldSelection } from '../../types';
import type { FieldCursorRect } from '../FieldCursors';

// Styles affecting the layout of the text
const COPIED_STYLES = [
  'direction', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth',
  'borderLeftWidth', 'borderStyle', 'paddingTop', 'paddingRight',
  'paddingBottom', 'paddingLeft', 'fontStyle', 'fontVariant', 'fontWeight',
  'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily',
  'fontFeatureSettings', 'textAlign', 'textTransform', 'textIndent',
  'letterSpacing', 'wordSpacing', 'tabSize',
] as const;

export declare interface MeasuredSelection {
  caret: FieldCursorRect | null;
  selection: FieldCursorRect[];
}

/**
 * Measures where a selection is displayed in an input or a textarea, using a
 * hidden copy of the field's text (form fields don't expose text positions).
 * Rects are relative to `container`, and limited to the field's visible area.
 */
export const measureTextSelection = (
  input: HTMLInputElement | HTMLTextAreaElement,
  container: HTMLElement,
  { anchor, head }: FieldSelection,
): MeasuredSelection => {
  const doc = input.ownerDocument;
  const style = getComputedStyle(input);
  const isInput = input.tagName === 'INPUT';
  const containerRect = container.getBoundingClientRect();
  const inputRect = input.getBoundingClientRect();
  const offsetTop = inputRect.top - containerRect.top;
  const offsetLeft = inputRect.left - containerRect.left;

  const mirror = doc.createElement('div');
  COPIED_STYLES.forEach(p => { mirror.style[p] = style[p]; });
  Object.assign(mirror.style, {
    position: 'absolute',
    visibility: 'hidden',
    top: `${offsetTop}px`,
    left: `${offsetLeft}px`,
    boxSizing: 'content-box',
    // Without the scrollbar, if any
    width: `${input.clientWidth - parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight)}px`,
    whiteSpace: isInput ? 'pre' : 'pre-wrap',
    overflowWrap: isInput ? 'normal' : 'break-word',
    overflow: 'hidden',
  });

  const text = input.value;
  const from = Math.max(0, Math.min(anchor, head, text.length));
  const to = Math.max(0, Math.min(Math.max(anchor, head), text.length));
  const selected = doc.createElement('span');
  selected.textContent = text.slice(from, to);
  const caret = doc.createElement('span');
  caret.textContent = '​';

  mirror.append(doc.createTextNode(text.slice(0, from)));

  if (Math.min(head, text.length) <= from) {
    mirror.append(caret, selected);
  } else {
    mirror.append(selected, caret);
  }

  mirror.append(doc.createTextNode(text.slice(to)));
  container.appendChild(mirror);

  const caretRect = caret.getBoundingClientRect();

  // Inputs center their text vertically
  let shiftY = -input.scrollTop;

  if (isInput) {
    const contentHeight = input.clientHeight - parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom);
    shiftY += Math.max(0, (contentHeight - caretRect.height) / 2);
  }

  const toRect = (r: DOMRect, width = r.width): FieldCursorRect => ({
    top: r.top - containerRect.top + shiftY,
    left: r.left - containerRect.left - input.scrollLeft,
    width,
    height: r.height,
  });

  const caretPosition = toRect(caretRect, 0);
  const selection = Array.from(selected.getClientRects())
    .filter(r => r.width > 0)
    .map(r => toRect(r));

  mirror.remove();

  // Visible area of the field
  const box = {
    top: offsetTop + input.clientTop,
    left: offsetLeft + input.clientLeft,
    bottom: offsetTop + input.clientTop + input.clientHeight,
    right: offsetLeft + input.clientLeft + input.clientWidth,
  };

  const clip = (r: FieldCursorRect): FieldCursorRect | null => {
    const top = Math.max(r.top, box.top);
    const left = Math.max(r.left, box.left);
    const bottom = Math.min(r.top + r.height, box.bottom);
    const right = Math.min(r.left + r.width, box.right);

    return bottom > top && right >= left
      ? { top, left, width: right - left, height: bottom - top }
      : null;
  };

  const visibleCaret = clip(caretPosition);

  return {
    // A caret partially hidden (scrolled) is not displayed
    caret: visibleCaret && visibleCaret.height >= caretPosition.height - 1
      ? { ...visibleCaret, width: 0 }
      : null,
    selection: selection.map(clip).filter(Boolean),
  };
};
