import { useMemo } from 'react';
import { Draggable, Droppable, classNames } from '@junipero/react';

import { useBuilder } from '../hooks';
import Icon from '../Icon';
import Text from '../Text';

const Element = ({ element, parent, className }) => {
  const { builder } = useBuilder();

  const component = useMemo(() => (
    builder.getComponent(element?.type)
  ), [element?.type]);

  const rendered = component?.render?.({
    element,
    component,
    parent,
    builder,
    className: element.className,
  }) || null;

  const onDrop_ = () => {
    // TODO
  };

  return (
    <Droppable
      disabled={component?.droppable === false}
      onDrop={onDrop_}
    >
      <Draggable
        data={element}
        disabled={component?.draggable === false}
      >
        <div
          data-element-id={element.id}
          className={classNames(
            'oak element',
            'type-' + (component?.id || 'unknown'),
            className
          )}
        >
          { component?.hasCustomInnerContent ? rendered : component ? (
            <div className="inner oak-flex oak-gap-2 oak-p-4">
              <Icon
                className="!oak-text-3xl"
                children={typeof component?.icon === 'function'
                  ? component.icon.bind(null, component)
                  : component?.icon}
              />
              <div className="element-info">
                <h6 className="junipero"><Text>{ component?.name }</Text></h6>
                <div className="element-content">{ rendered }</div>
              </div>
            </div>
          ) : (
            <div className="inner oak-flex oak-gap-2 oak-p-4">
              <Icon>help_circle</Icon>
              <div className="element-info">
                <h6 className="junipero oak-m-0 oak-mb-2">
                  <Text name="core.components.unknown">Unknown</Text>
                </h6>
                <div className="element-content">
                  { JSON.stringify(element) }
                </div>
              </div>
            </div>
          ) }
        </div>
      </Draggable>
    </Droppable>
  );
};

Element.displayName = 'Element';

export default Element;
