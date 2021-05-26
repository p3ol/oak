import { Fragment, useRef } from 'react';
import { classNames } from '@poool/junipero-utils';
import { nanoid } from 'nanoid';

import { COMPONENT_DEFAULT } from '../../components';
import { useBuilder } from '../../hooks';
import Option from '../Option';
import Draggable from '../Draggable';
import Droppable from '../Droppable';
import Editable from '../Editable';

const Element = ({
  element,
  parent,
  className,
}) => {
  const editableRef = useRef();
  const elementInnerRef = useRef();
  const settingsElementRef = useRef();
  const builder = useBuilder();
  const { getComponent, removeElement, moveElement } = builder;

  const onDelete_ = e => {
    e?.preventDefault();
    removeElement(element, { parent });
  };

  const onDrop_ = (data, position) => {
    moveElement?.(data, element, { parent, position });
  };

  const onEdit_ = e => {
    e?.preventDefault();
    editableRef.current?.toggle();
  };

  const component = getComponent(element.type) ||
    COMPONENT_DEFAULT;

  return (
    <Droppable disabled={element.type === 'row'} onDrop={onDrop_}>
      <Draggable data={element} disabled={element.type === 'row'}>
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
            builder,
            onEdit: onEdit_,
            className: classNames('oak-inner', element.className),
          }) || null }

          <div className="oak-options">
            <Option
              option={{ icon: 'clear' }}
              className="oak-remove"
              onClick={onDelete_}
            />
            { component.options?.map((o, i) => (
              <Fragment key={i}>
                { o?.render?.({
                  option: o,
                  className: 'oak-option',
                  element,
                  elementInnerRef,
                  parent,
                  component,
                  builder,
                  index: i,
                }) }
              </Fragment>
            )) }
            { component.editable && (
              <Editable
                element={element}
                component={component}
                ref={editableRef}
                container={settingsElementRef}
              >
                <Option
                  option={{ icon: 'edit' }}
                  className="oak-edit"
                  onClick={onEdit_}
                />
              </Editable>
            ) }
          </div>

          <div ref={settingsElementRef} />
        </div>
      </Draggable>
    </Droppable>
  );
};

export default Element;
