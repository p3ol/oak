import {
  type ElementNode,
  type LexicalNode,
  type PointType,
  $createRangeSelection,
  $getRoot,
  $isElementNode,
  $isRootNode,
  $isTextNode,
  $setSelection,
} from 'lexical';

/*
 * Positions in the document are expressed as offsets in a linear
 * representation of the document: one character per text character, element
 * boundary, and other node (line breaks, horizontal rules...). They are used
 * to keep the selection when the content is replaced, and to share cursors
 * with other users.
 */

const ELEMENT_START = '\u0001';
const ELEMENT_END = '\u0002';
const OTHER = '\u0003';

const $getSize = (node: LexicalNode): number => {
  if ($isTextNode(node)) {
    return node.getTextContentSize();
  }

  if ($isElementNode(node)) {
    return node.getChildren().reduce((s, c) => s + $getSize(c), 2);
  }

  return 1;
};

const $serializeNode = (node: LexicalNode): string => {
  if ($isTextNode(node)) {
    return node.getTextContent();
  }

  if ($isElementNode(node)) {
    return ELEMENT_START +
      node.getChildren().map($serializeNode).join('') +
      ELEMENT_END;
  }

  return OTHER;
};

/** Linear representation of the document */
export const $serialize = () =>
  $getRoot().getChildren().map($serializeNode).join('');

/** Offset of a selection point */
export const $getPointOffset = (point: PointType) => {
  const node = point.getNode();
  let offset = 0;

  if ($isTextNode(node)) {
    offset = point.offset;
  } else if ($isElementNode(node)) {
    offset = node.getChildren().slice(0, point.offset)
      .reduce((s, c) => s + $getSize(c), $isRootNode(node) ? 0 : 1);
  }

  let current: LexicalNode | null = node;

  while (current && !$isRootNode(current)) {
    let sibling = current.getPreviousSibling();

    while (sibling) {
      offset += $getSize(sibling);
      sibling = sibling.getPreviousSibling();
    }

    current = current.getParent();

    if (current && !$isRootNode(current)) {
      offset += 1;
    }
  }

  return offset;
};

export declare interface PointLocation {
  key: string;
  offset: number;
  type: 'text' | 'element';
}

const $findPoint = (element: ElementNode, offset: number): PointLocation => {
  const children = element.getChildren();
  let remaining = offset;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const size = $getSize(child);

    if ($isTextNode(child) && remaining <= size) {
      return { key: child.getKey(), offset: remaining, type: 'text' };
    }

    if ($isElementNode(child) && remaining < size) {
      return $findPoint(child, Math.max(0, Math.min(remaining - 1, size - 2)));
    }

    if (!$isTextNode(child) && !$isElementNode(child) && remaining === 0) {
      return { key: element.getKey(), offset: i, type: 'element' };
    }

    remaining -= size;
  }

  return { key: element.getKey(), offset: children.length, type: 'element' };
};

/** Selection point at an offset (clamped to the document) */
export const $getPointAt = (offset: number) =>
  $findPoint($getRoot(), Math.max(0, offset));

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

export declare interface SavedSelection {
  text: string;
  anchor: number;
  focus: number;
}

export const $selectOffsets = (anchor: number, focus: number) => {
  const a = $getPointAt(anchor);
  const f = $getPointAt(focus);
  const selection = $createRangeSelection();
  selection.anchor.set(a.key, a.offset, a.type);
  selection.focus.set(f.key, f.offset, f.type);
  $setSelection(selection);
};
