import type {
  Builder,
  ComponentObject,
  ComponentOverride,
  ElementObject,
} from '@oakjs/core';

import { type ContentTree, type TreeNode, isSameOrDescendant } from './tree';

declare type ElementAbility = 'removable' | 'duplicable' | 'copyable';

/**
 * Whether an element can be removed, duplicated or copied (component or
 * override). Elements are removable & copyable by default, but only
 * duplicable when their component says so.
 */
export const canElement = (
  builder: Builder,
  element: ElementObject,
  ability: ElementAbility,
): boolean => {
  const component = builder.getComponent(element?.type) as ComponentObject;
  const override = builder.getOverride(
    'component', element?.type
  ) as ComponentOverride & Partial<Record<ElementAbility, boolean>>;
  const value = (override as any)?.[ability] ?? (component as any)?.[ability];

  return ability === 'duplicable' ? !!value : value !== false;
};

/**
 * Selected elements that are not inside another selected element (actions
 * on a parent already apply to its children), in the order of the content
 */
export const getSelectedNodes = (
  tree: ContentTree,
  ids: string[],
): TreeNode[] => {
  const existing = ids.filter(id => tree.nodes.has(id));
  const order = Array.from(tree.nodes.keys());

  return existing
    .filter(id => !existing.some(other => (
      other !== id && isSameOrDescendant(tree, other, id)
    )))
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map(id => tree.nodes.get(id));
};

/**
 * Element to select once the given ones are removed: the parent of the first
 * one, if it is not removed itself
 */
export const getSelectionAfterRemoval = (nodes: TreeNode[]) => {
  const parent = nodes[0]?.parent;

  return parent && !nodes.some(n => n.element === parent)
    ? String(parent.id)
    : null;
};

/**
 * Removes the elements that can be removed (undone at once), returns the
 * removed ones
 */
export const removeElements = (builder: Builder, nodes: TreeNode[]) => {
  const removable = nodes
    .filter(node => canElement(builder, node.element, 'removable'));

  builder.batch(() => removable.forEach(node => {
    builder.removeElement(node.element.id, { parent: node.container });
  }));

  return removable;
};

/**
 * Duplicates the elements that can be duplicated (undone at once), returns
 * the duplicates
 */
export const duplicateElements = (
  builder: Builder,
  nodes: TreeNode[],
): ElementObject[] => builder.batch(() => nodes
  .filter(node => canElement(builder, node.element, 'duplicable'))
  .map(node => builder.duplicateElement(node.element, {
    parent: node.container,
  }))
  .filter(Boolean));
