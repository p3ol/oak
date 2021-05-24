import { Fragment, useRef } from 'react';
import { classNames } from '@poool/junipero-utils';
import { nanoid } from 'nanoid';

import { COMPONENT_DEFAULT } from '../../components';
import { useBuilder } from '../../hooks';
import Option from '../Option';
import Draggable from '../Draggable';
import Droppable from '../Droppable';

const Element = ({
  element,
  parent,
  className,
}) => {
  const elementInnerRef = useRef();
  const { renderers, removeElement, moveElement } = useBuilder();

  const onDelete_ = e => {
    e?.preventDefault();
    removeElement(element, { parent });
  };

  const onDrop_ = (data, position) => {
    if (data.id === element.id) {
      return;
    }

    moveElement?.(data, element, { parent, position });
  };

  const onEdit_ = e => {
    e.preventDefault();
  };

  const component = renderers.find(r => r.id === element.type) ||
    COMPONENT_DEFAULT;

  return (
    <Droppable disabled={element.type === 'row'} onDrop={onDrop_}>
      <Draggable
        data={element}
        disabled={element.type === 'row'}
      >
        <div
          ref={elementInnerRef}
          id={element.id || nanoid()}
          className={classNames(
            'oak-element',
            'oak-' + element.type,
            className
          )}
        >
          { component?.render?.({
            element,
            parent,
            className: classNames('oak-inner', element.className),
          }) || null }

          <div className="oak-options">
            <Option
              option={{ icon: 'close' }}
              className="oak-remove"
              onClick={onDelete_}
            />
            { component.options?.map((o, i) => (
              <Fragment key={i}>
                { o?.render?.({
                  option: o,
                  className: 'oak-option',
                  element,
                  component,
                  index: i,
                }) }
              </Fragment>
            )) }
            { component.editable && (
              <Option
                option={{ icon: 'edit' }}
                className="oak-edit"
                onClick={onEdit_}
              />
            ) }
          </div>

          {/* { debug && (
            <pre>
              <p>Element:</p>
              { JSON.stringify(element, null, 2) }
            </pre>
          )} */}
        </div>
      </Draggable>
    </Droppable>
  );
};

export default Element;
