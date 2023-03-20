import { useMemo } from 'react';
import { classNames } from '@junipero/react';

import { useBuilder } from '../hooks';
import Icon from '../Icon';

const Element = ({ element, parent, className }) => {
  const builder = useBuilder();

  const component = useMemo(() => (
    builder.getComponent(element?.type)
  ), [element?.type]);

  const rendered = component?.render?.({
    element,
    component,
    parent,
    builder,
    className: classNames('element-content', element.className),
  }) || null;

  return (
    <div
      data-element-id={element.id}
      className={classNames(
        'oak element',
        'type-' + element.type,
        className
      )}
    >
      { component.hasCustomInnerContent ? rendered : (
        <div className="inner">
          <div className="element-icon">
            { typeof component?.icon === 'function'
              ? component.icon({ component, className: 'oak-icons' })
              : <Icon>{ component?.icon }</Icon>
            }
          </div>
          <div className="element-info">
            <div>{ component?.name }</div>
            <div className="element-content">{ rendered }</div>
          </div>
        </div>
      )}
    </div>
  );
};

Element.displayName = 'Element';

export default Element;
