import type {
  Builder,
  ComponentObject,
  ComponentOverride,
  ElementObject,
} from '@oakjs/core';

import type { DragSource, DropIndicator, DropTarget } from './types';
import {
  type ContentTree,
  type TreeContainer,
  type TreeNode,
  ROOT_CONTAINER_KEY,
  findContainer,
  isSameOrDescendant,
} from './tree';

export const DRAG_DATA_KEY = 'oakSource';

const getComponentAndOverride = (builder: Builder, type: string) => ({
  component: builder.getComponent(type) as ComponentObject,
  override: builder.getOverride('component', type) as ComponentOverride,
});

/**
 * Structural components (like columns) cannot be inserted from the catalogue
 * and can only be reordered inside their own container.
 */
export const isStructural = (builder: Builder, type: string) => {
  const { component, override } = getComponentAndOverride(builder, type);

  return (override?.usable ?? component?.usable) === false;
};

export const getSourceType = (
  tree: ContentTree,
  source: DragSource,
): string | undefined =>
  source.type === 'element'
    ? tree.nodes.get(source.id)?.element?.type
    : source.componentId;

export const canDrag = (builder: Builder, element: ElementObject) => {
  const { override } = getComponentAndOverride(builder, element?.type);

  return override?.draggable !== false;
};

export const canDrop = (
  builder: Builder,
  tree: ContentTree,
  source: DragSource,
  target: Pick<DropTarget, 'container' | 'owner'>,
): boolean => {
  const type = getSourceType(tree, source);

  if (!type || !builder.getComponent(type)) {
    return false;
  }

  if (source.type === 'element') {
    const node = tree.nodes.get(source.id);

    if (!node) {
      return false;
    }

    // Cannot drop an element inside itself
    if (
      target.owner &&
      isSameOrDescendant(tree, source.id, String(target.owner.id))
    ) {
      return false;
    }

    if (isStructural(builder, type)) {
      return node.container === target.container;
    }
  } else if (isStructural(builder, type)) {
    return false;
  }

  // Containers holding structural elements (e.g. row columns) only accept
  // their own children
  if (target.container.some(e => e && isStructural(builder, e.type))) {
    return false;
  }

  if (target.owner) {
    const { component, override } = getComponentAndOverride(
      builder, target.owner.type
    );

    // Like in @oakjs/react, `droppable: false` on a component (row, foldable,
    // clickable...) only means the element itself is not a drop zone (its
    // containers still are). Only an override can disable its containers.
    if (
      override?.droppable === false ||
      component?.disallow?.includes?.(type) ||
      override?.disallow?.includes?.(type)
    ) {
      return false;
    }
  }

  return true;
};

/**
 * Moves an existing element or creates a new one at the given target.
 * Returns the moved/created element.
 */
export const commitDrop = (
  builder: Builder,
  tree: ContentTree,
  source: DragSource,
  target: DropTarget,
): ElementObject | undefined => {
  if (!canDrop(builder, tree, source, target)) {
    return;
  }

  const { container, owner, index } = target;

  if (source.type === 'component') {
    const component = builder.getComponent(source.componentId);

    return builder.addElement({}, {
      component,
      parent: container,
      index,
    });
  }

  const element = tree.nodes.get(source.id)?.element;

  if (!element) {
    return;
  }

  // Core only knows how to move an element relatively to a sibling
  if (!container.length) {
    return builder.moveElement(element, owner || {}, {
      parent: container,
      position: 'after',
    });
  }

  if (index >= container.length) {
    return builder.moveElement(element, container[container.length - 1], {
      parent: container,
      position: 'after',
    });
  }

  return builder.moveElement(element, container[Math.max(0, index)], {
    parent: container,
    position: 'before',
  });
};

/**
 * Finds where to insert a new component when clicking on it in the
 * catalogue: after the selected element if possible, inside it if it's a
 * container, or at the end of the page otherwise.
 */
export const getDefaultInsertTarget = (
  builder: Builder,
  tree: ContentTree,
  componentId: string,
  selectedId: string | null,
): DropTarget => {
  const source: DragSource = { type: 'component', componentId };
  const candidates: DropTarget[] = [];
  let node = selectedId ? tree.nodes.get(selectedId) : null;

  while (node) {
    node.containers.forEach(c => candidates.push({
      container: c.elements,
      owner: c.owner,
      containerKey: c.key,
      index: c.elements.length,
    }));

    candidates.push({
      container: node.container,
      owner: node.parent,
      containerKey: node.containerKey,
      index: node.index + 1,
    });

    const target = candidates.find(t => canDrop(builder, tree, source, t));

    if (target) {
      return target;
    }

    candidates.length = 0;
    node = node.parent ? tree.nodes.get(String(node.parent.id)) : null;
  }

  return {
    container: tree.root.elements,
    owner: null,
    containerKey: ROOT_CONTAINER_KEY,
    index: tree.root.elements.length,
  };
};

/* ---------------------------------------------------------------------------
 * DOM based drop resolution (canvas)
 * ------------------------------------------------------------------------ */

export declare interface DomDropResult {
  target: DropTarget;
  indicator: DropIndicator;
}

const isHorizontal = (el: Element | null) => {
  if (!el) {
    return false;
  }

  const style = getComputedStyle(el);

  return /flex/.test(style.display) && /^row/.test(style.flexDirection);
};

/**
 * Converts a DOM rect into the unscaled coordinates of the page frame
 * (the canvas content may be zoomed through css transforms).
 */
export const toFrameRect = (frame: HTMLElement, rect: DOMRect) => {
  const frameRect = frame.getBoundingClientRect();
  const zoom = frame.offsetWidth ? frameRect.width / frame.offsetWidth : 1;

  return {
    x: (rect.left - frameRect.left) / zoom,
    y: (rect.top - frameRect.top) / zoom,
    width: rect.width / zoom,
    height: rect.height / zoom,
  };
};

const LINE_SIZE = 2;

const getLineIndicator = (
  frame: HTMLElement,
  el: Element,
  side: 'before' | 'after',
  horizontal: boolean,
): DropIndicator => {
  const rect = toFrameRect(frame, el.getBoundingClientRect());

  return horizontal
    ? {
      kind: 'line',
      x: side === 'before' ? rect.x - LINE_SIZE / 2
        : rect.x + rect.width - LINE_SIZE / 2,
      y: rect.y,
      width: LINE_SIZE,
      height: rect.height,
    }
    : {
      kind: 'line',
      x: rect.x,
      y: side === 'before' ? rect.y - LINE_SIZE / 2
        : rect.y + rect.height - LINE_SIZE / 2,
      width: rect.width,
      height: LINE_SIZE,
    };
};

const getChildElements = (containerEl: Element) =>
  Array.from(containerEl.children)
    .filter(c => c.hasAttribute('data-oak-id') &&
      (c as HTMLElement).offsetParent !== null);

const resolveContainerDrop = (
  frame: HTMLElement,
  containerEl: Element,
  container: TreeContainer,
  tree: ContentTree,
  x: number,
  y: number,
): DomDropResult => {
  const base = {
    container: container.elements,
    owner: container.owner,
    containerKey: container.key,
  };
  const children = getChildElements(containerEl);

  if (!children.length) {
    return {
      target: { ...base, index: container.elements.length },
      indicator: {
        kind: 'box',
        ...toFrameRect(frame, containerEl.getBoundingClientRect()),
      },
    };
  }

  const horizontal = isHorizontal(containerEl);

  for (const child of children) {
    const rect = child.getBoundingClientRect();
    const middle = horizontal
      ? rect.left + rect.width / 2
      : rect.top + rect.height / 2;

    if ((horizontal ? x : y) < middle) {
      const node = tree.nodes.get(child.getAttribute('data-oak-id'));

      return {
        target: { ...base, index: node?.index ?? 0 },
        indicator: getLineIndicator(frame, child, 'before', horizontal),
      };
    }
  }

  const last = children[children.length - 1];
  const lastNode = tree.nodes.get(last.getAttribute('data-oak-id'));

  return {
    target: { ...base, index: (lastNode?.index ?? -1) + 1 },
    indicator: getLineIndicator(frame, last, 'after', horizontal),
  };
};

/**
 * Finds the drop target under the given (client) coordinates, by walking up
 * the DOM from the hovered node and returning the first valid target.
 */
export const resolveDomDrop = (
  builder: Builder,
  tree: ContentTree,
  frame: HTMLElement,
  source: DragSource,
  x: number,
  y: number,
): DomDropResult | null => {
  const hit = frame.ownerDocument.elementFromPoint(x, y);

  if (!hit || !frame.contains(hit)) {
    return null;
  }

  const draggedEl = source.type === 'element'
    ? frame.querySelector(`[data-oak-id="${CSS.escape(source.id)}"]`)
    : null;

  for (
    let node: Element | null = hit;
    node && frame.contains(node);
    node = node.parentElement
  ) {
    if (draggedEl?.contains(node)) {
      continue;
    }

    // Dropping inside a container (e.g. in an empty column or between
    // children)
    const containerKey = node.getAttribute('data-oak-container');

    if (containerKey) {
      const ownerId = containerKey === ROOT_CONTAINER_KEY
        ? null
        : node.closest('[data-oak-id]')?.getAttribute('data-oak-id');
      const container = findContainer(tree, ownerId, containerKey);

      if (
        container &&
        canDrop(builder, tree, source, {
          container: container.elements,
          owner: container.owner,
        })
      ) {
        return resolveContainerDrop(frame, node, container, tree, x, y);
      }
    }

    // Dropping before/after an element
    const id = node.getAttribute('data-oak-id');
    const treeNode = id ? tree.nodes.get(id) : null;

    if (
      treeNode &&
      canDrop(builder, tree, source, {
        container: treeNode.container,
        owner: treeNode.parent,
      })
    ) {
      const horizontal = isHorizontal(node.parentElement);
      const rect = node.getBoundingClientRect();
      const after = horizontal
        ? x >= rect.left + rect.width / 2
        : y >= rect.top + rect.height / 2;

      return {
        target: {
          container: treeNode.container,
          owner: treeNode.parent,
          containerKey: treeNode.containerKey,
          index: treeNode.index + (after ? 1 : 0),
        },
        indicator: getLineIndicator(
          frame, node, after ? 'after' : 'before', horizontal
        ),
      };
    }
  }

  return null;
};

export const parseDragData = (data: any): DragSource | null => {
  const source = data?.[DRAG_DATA_KEY];

  if (source?.type === 'element' && source.id !== undefined) {
    return { type: 'element', id: String(source.id) };
  }

  if (source?.type === 'component' && source.componentId) {
    return { type: 'component', componentId: source.componentId };
  }

  return null;
};

/**
 * Returns the closest element (itself or an ancestor) having a container of
 * structural children (e.g. a row and its columns), with that container.
 */
export const getClosestStructuralOwner = (
  builder: Builder,
  tree: ContentTree,
  id: string | null,
): { node: TreeNode; container: TreeContainer } | null => {
  let node = id ? tree.nodes.get(id) : null;

  while (node) {
    const container = node.containers.find(c =>
      c.elements.some(e => e && isStructural(builder, e.type))
    );

    if (container) {
      return { node, container };
    }

    node = node.parent ? tree.nodes.get(String(node.parent.id)) : null;
  }

  return null;
};

/**
 * Adds a structural child (e.g. a column) at the start or end of a container
 * of structural children, using the same type as its siblings.
 */
export const addStructuralChild = (
  builder: Builder,
  container: TreeContainer,
  position: 'before' | 'after',
): ElementObject | undefined => {
  const type = container.elements.find(e => e && isStructural(builder, e.type))
    ?.type;
  const component = type ? builder.getComponent(type) : null;

  if (!component) {
    return;
  }

  return builder.addElement({}, {
    component,
    parent: container.elements,
    index: position === 'before' ? 0 : container.elements.length,
  });
};
