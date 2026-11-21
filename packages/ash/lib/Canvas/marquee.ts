import type { ContentTree } from '../tree';
import { getSelectedNodes } from '../selection';

export declare interface MarqueeRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Rect between two points, whatever the drag direction
 */
export const getMarqueeRect = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): MarqueeRect => ({
  left: Math.min(x1, x2),
  top: Math.min(y1, y2),
  right: Math.max(x1, x2),
  bottom: Math.max(y1, y2),
});

/**
 * Elements selected by a selection box (in viewport coordinates), like on a
 * desktop: every element the box touches, except the ones containing the
 * whole box (dragging inside a container selects its children, not the
 * container itself). Only the outermost elements are kept (selecting a
 * parent already selects its children), in the order of the content.
 */
export const getMarqueeSelection = (
  frame: HTMLElement,
  tree: ContentTree,
  rect: MarqueeRect,
): string[] => {
  const ids = new Set<string>();

  frame.querySelectorAll<HTMLElement>('[data-oak-id]').forEach(el => {
    const id = el.getAttribute('data-oak-id');

    // Hidden elements (e.g. inside a collapsed component) can't be selected
    if (!id || !tree.nodes.has(id) || el.offsetParent === null) {
      return;
    }

    const r = el.getBoundingClientRect();
    const touches = r.width > 0 && r.height > 0 &&
      r.left < rect.right && r.right > rect.left &&
      r.top < rect.bottom && r.bottom > rect.top;
    const containsBox = r.left <= rect.left && r.right >= rect.right &&
      r.top <= rect.top && r.bottom >= rect.bottom;

    if (touches && !containsBox) {
      ids.add(id);
    }
  });

  return getSelectedNodes(tree, Array.from(ids)).map(node => node.id);
};
