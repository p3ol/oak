import type { ComponentObject } from '@oakjs/core';
import { Draggable, classNames } from '@junipero/react';

import { useEditor } from '../hooks';
import { DRAG_DATA_KEY } from '../dnd';
import Icon from '../Icon';
import Text from '../Text';

export declare interface ComponentButtonProps {
  component: ComponentObject;
  onClick: (component: ComponentObject) => void;
  compact?: boolean;
}

/**
 * A component of the catalogue: click to insert it, or drag it onto the
 * canvas or the layers panel.
 */
const ComponentButton = ({
  component,
  onClick,
  compact,
}: ComponentButtonProps) => {
  const { setDragSource } = useEditor();

  return (
    <Draggable
      data={{
        [DRAG_DATA_KEY]: { type: 'component', componentId: component.id },
      }}
      onDragStart={() => setDragSource({
        type: 'component', componentId: component.id,
      })}
      onDragEnd={() => setDragSource(null)}
    >
      <button
        type="button"
        onClick={() => onClick(component)}
        className={classNames(
          'oak:flex oak:items-center oak:rounded-md oak:border',
          'oak:border-ash-border oak:bg-ash-surface oak:cursor-grab oak:text-ash-text',
          'oak:text-xs oak:hover:border-velvet oak:hover:text-velvet',
          'oak:transition-colors oak:min-w-0',
          compact
            ? 'oak:gap-2 oak:h-9 oak:px-2'
            : 'oak:flex-col oak:justify-center oak:gap-1 oak:h-16 oak:px-2',
        )}
      >
        <Icon className={compact ? 'oak:text-lg!' : 'oak:text-2xl!'}>
          { typeof component.icon === 'function'
            ? (component.icon as any).bind(null, component)
            : component.icon }
        </Icon>
        <span className="oak:truncate oak:max-w-full">
          <Text>{ component.name }</Text>
        </span>
      </button>
    </Draggable>
  );
};

ComponentButton.displayName = 'ComponentButton';

export default ComponentButton;
