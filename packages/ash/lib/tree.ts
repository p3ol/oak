import type {
  Builder,
  ComponentObject,
  ComponentOverride,
  ElementObject,
} from '@oakjs/core';

export declare interface TreeContainer {
  /** Key of the container inside its owner (e.g. `content`, `cols`) */
  key: string;
  /** The actual (mutable) array stored in the builder content */
  elements: ElementObject[];
  owner: ElementObject | null;
  nodes: TreeNode[];
}

export declare interface TreeNode {
  id: string;
  element: ElementObject;
  /** Element owning the container this element is in (null = root) */
  parent: ElementObject | null;
  /** Container this element is in */
  container: ElementObject[];
  containerKey: string;
  index: number;
  depth: number;
  containers: TreeContainer[];
}

export declare interface ContentTree {
  root: TreeContainer;
  nodes: Map<string, TreeNode>;
}

export const ROOT_CONTAINER_KEY = 'root';

/**
 * Returns the child containers of an element, using the component (or its
 * override) `getContainers` method, and defaulting to `element.content`.
 */
export const getElementContainers = (
  builder: Builder,
  element: ElementObject,
): ElementObject[][] => {
  const component = builder.getComponent(element?.type);
  const override = builder
    .getOverride('component', element?.type) as ComponentOverride;
  const containers = (override as any)?.getContainers?.(element) ||
    (component as ComponentObject)?.getContainers?.(element) ||
    [element?.content];

  return (containers || []).filter(Array.isArray);
};

/**
 * Finds the key of a container inside its owner by reference, so that the
 * container can be located from the DOM (see `containerAttributes` in
 * @oakjs/react-renderer)
 */
export const getContainerKey = (
  element: ElementObject,
  container: ElementObject[],
  index: number,
) => Object.keys(element).find(k => element[k] === container) ??
  `__container_${index}`;

export const buildTree = (
  builder: Builder,
  content: ElementObject[],
): ContentTree => {
  const nodes = new Map<string, TreeNode>();

  const walk = (
    elements: ElementObject[],
    owner: ElementObject | null,
    key: string,
    depth: number,
  ): TreeContainer => {
    const container: TreeContainer = {
      key,
      elements,
      owner,
      nodes: [],
    };

    elements.forEach((element, index) => {
      if (!element) {
        return;
      }

      const node: TreeNode = {
        id: String(element.id),
        element,
        parent: owner,
        container: elements,
        containerKey: key,
        index,
        depth,
        containers: [],
      };

      nodes.set(node.id, node);
      container.nodes.push(node);

      node.containers = getElementContainers(builder, element)
        .map((arr, i) => walk(
          arr, element, getContainerKey(element, arr, i), depth + 1,
        ));
    });

    return container;
  };

  const root = walk(content || [], null, ROOT_CONTAINER_KEY, 0);

  return { root, nodes };
};

/**
 * Returns true if `id` is the element itself or one of its descendants
 */
export const isSameOrDescendant = (
  tree: ContentTree,
  ancestorId: string,
  id: string,
): boolean => {
  let node = tree.nodes.get(id);

  while (node) {
    if (node.id === ancestorId) {
      return true;
    }

    node = node.parent ? tree.nodes.get(String(node.parent.id)) : null;
  }

  return false;
};

/**
 * Returns the ancestors of an element, from the root to its direct parent
 */
export const getAncestors = (tree: ContentTree, id: string): TreeNode[] => {
  const ancestors: TreeNode[] = [];
  let node = tree.nodes.get(id);

  while (node?.parent) {
    node = tree.nodes.get(String(node.parent.id));

    if (node) {
      ancestors.unshift(node);
    }
  }

  return ancestors;
};

export const findContainer = (
  tree: ContentTree,
  ownerId: string | null,
  key: string,
): TreeContainer | null => {
  if (!ownerId || key === ROOT_CONTAINER_KEY) {
    return tree.root;
  }

  return tree.nodes.get(ownerId)?.containers.find(c => c.key === key) || null;
};
