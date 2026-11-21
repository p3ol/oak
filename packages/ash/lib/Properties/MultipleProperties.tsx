import type { ComponentObject } from '@oakjs/core';
import { classNames } from '@junipero/react';

import { useBuilder, useEditor } from '../hooks';
import { serializeElements } from '../clipboard';
import {
  canElement,
  duplicateElements,
  getSelectedNodes,
  getSelectionAfterRemoval,
  removeElements,
} from '../selection';
import { copyToClipboard } from '../utils';
import Icon from '../Icon';
import Text from '../Text';
import { ActionButton } from './ElementProperties';

/**
 * Displayed instead of the element properties when several elements are
 * selected: actions applying to all of them, and the selected elements
 */
const MultipleProperties = () => {
  const { builder } = useBuilder();
  const { tree, selectedIds, select, selectMany } = useEditor();
  const nodes = getSelectedNodes(tree, selectedIds);
  const selectedNodes = selectedIds
    .map(id => tree.nodes.get(id))
    .filter(Boolean);

  const copyable = nodes.filter(n => canElement(builder, n.element, 'copyable'));
  const duplicable = nodes
    .some(n => canElement(builder, n.element, 'duplicable'));
  const removable = nodes
    .some(n => canElement(builder, n.element, 'removable'));

  const onCopy = () => {
    copyToClipboard(serializeElements(copyable.map(n => n.element)));
  };

  const onDuplicate = () => {
    const duplicates = duplicateElements(builder, nodes);

    if (duplicates.length) {
      selectMany(duplicates.map(e => String(e.id)));
    }
  };

  const onRemove = () => {
    const removed = removeElements(builder, nodes);

    if (removed.length) {
      const next = getSelectionAfterRemoval(removed);
      selectMany(next ? [next] : []);
    }
  };

  return (
    <div
      className="oak-ash-multiple-properties oak:flex oak:flex-col oak:min-h-0 oak:flex-auto"
    >
      <div
        className={classNames(
          'oak:flex oak:items-center oak:gap-2 oak:px-4 oak:py-3',
          'oak:border-b oak:border-ash-border',
        )}
      >
        <h3
          className={classNames(
            'oak:m-0 oak:flex-auto oak:text-sm oak:font-semibold',
            'oak:truncate oak:text-ash-text',
          )}
          data-testid="SelectionCount"
        >
          { selectedIds.length }{ ' ' }
          <Text name="ash.properties.selectedElements">
            elements selected
          </Text>
        </h3>
        <div className="oak:flex oak:items-center">
          { copyable.length > 0 && (
            <ActionButton
              icon="copy_file"
              onClick={onCopy}
              title={<Text name="core.tooltips.copy">Copy</Text>}
            />
          ) }
          { duplicable && (
            <ActionButton
              icon="copy"
              onClick={onDuplicate}
              title={<Text name="core.tooltips.duplicate">Duplicate</Text>}
            />
          ) }
          { removable && (
            <ActionButton
              danger
              icon="close"
              onClick={onRemove}
              title={<Text name="core.tooltips.remove">Remove</Text>}
            />
          ) }
        </div>
      </div>

      <div className="oak:flex-auto oak:overflow-y-auto oak:min-h-0 oak:py-2">
        { selectedNodes.map(node => {
          const component = builder
            .getComponent(node.element.type) as ComponentObject;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => select(node.id)}
              className={classNames(
                'oak:flex oak:items-center oak:gap-2 oak:w-full oak:px-4',
                'oak:py-1.5 oak:border-0 oak:bg-transparent oak:text-left',
                'oak:text-[13px] oak:text-ash-text oak:cursor-pointer',
                'oak:hover:bg-ash-muted',
              )}
            >
              <Icon className="oak:text-base! oak:text-ash-text-muted">
                { typeof component?.icon === 'function'
                  ? (component.icon as any).bind(null, component)
                  : component?.icon || 'help_circle' }
              </Icon>
              <span className="oak:truncate">
                { component
                  ? <Text>{ component.name || component.id }</Text>
                  : node.element.type }
              </span>
            </button>
          );
        }) }
      </div>

      <div className="oak:flex-none oak:px-4 oak:py-3 oak:border-t oak:border-ash-border">
        <button
          type="button"
          onClick={() => select(null)}
          className={classNames(
            'oak:border-0 oak:bg-transparent oak:p-0 oak:text-xs',
            'oak:text-ash-text-muted oak:cursor-pointer oak:hover:text-velvet',
          )}
        >
          <Text name="ash.properties.clearSelection">Clear selection</Text>
        </button>
      </div>
    </div>
  );
};

MultipleProperties.displayName = 'MultipleProperties';

export default MultipleProperties;
