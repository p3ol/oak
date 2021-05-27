import { Fragment, useRef, useCallback } from 'react';
import { classNames } from '@poool/junipero-utils';
import { nanoid } from 'nanoid';

import { COMPONENT_DEFAULT } from '../../defaults';
import { ElementContext } from '../../contexts';
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
  const builder = useBuilder();
  const { getComponent, removeElement, moveElement } = builder;

  const getContext = useCallback(() => ({
    element,
    parent,
  }), [element, parent]);

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
    <ElementContext.Provider value={getContext()}>
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
                >
                  <Option
                    option={{ icon: 'edit' }}
                    className="oak-edit"
                    onClick={onEdit_}
                  />
                </Editable>
              ) }
            </div>
          </div>
        </Draggable>
      </Droppable>
    </ElementContext.Provider>
  );
};

export default Element;
