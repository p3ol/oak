import type { Builder, ElementObject } from '@oakjs/core';

import type { ContentTree } from './tree';
import { canDrop, getDefaultInsertTarget } from './dnd';

/**
 * Returns the elements contained in a clipboard text (a single element or
 * an array of elements, as JSON), ignoring unknown components.
 */
export const parseClipboardElements = (
  builder: Builder,
  text: string | null | undefined,
): ElementObject[] => {
  if (!text) {
    return [];
  }

  try {
    return [].concat(JSON.parse(text))
      .filter(e => e && typeof e === 'object' && e.type &&
        builder.getComponent(e.type));
  } catch {
    return [];
  }
};

export const serializeElements = (elements: ElementObject[]) =>
  JSON.stringify(elements.length === 1 ? elements[0] : elements);

/**
 * Pastes elements after (or inside) the selected element, or at the end of
 * the page. New ids are generated for every pasted element.
 */
export const pasteElements = (
  builder: Builder,
  tree: ContentTree,
  selectedId: string | null,
  elements: ElementObject[],
): ElementObject[] | undefined => {
  if (!elements.length) {
    return;
  }

  const target = getDefaultInsertTarget(
    builder, tree, elements[0].type, selectedId
  );

  if (
    !elements.every(e => canDrop(builder, tree, {
      type: 'component', componentId: e.type,
    }, target))
  ) {
    return;
  }

  return builder.addElements(elements, {
    parent: target.container,
    index: target.index,
    resetIds: true,
  });
};
