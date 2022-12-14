import { Fragment, useRef, useCallback, useState } from 'react';
import { classNames } from '@junipero/react';
import { v4 as uuid } from 'uuid';

import { COMPONENT_DEFAULT } from '../../defaults';
import { ElementContext } from '../../contexts';
import { useBuilder, useOptions } from '../../hooks';
import { copyToClipboard } from '../../utils';
import Option from '../Option';
import Draggable from '../Draggable';
import Droppable from '../Droppable';
import Editable from '../Editable';
import Icon from '../Icon';
import Text from '../Text';
import Property from './Property';

const Element = ({
  element,
  parent,
  className,
}) => {
  const editableRef = useRef();
  const elementInnerRef = useRef();
  const builder = useBuilder();
  const [editableOpened, setEditableOpened] = useState(false);
  const {
    getComponent,
    removeElement,
    duplicateElement,
    moveElement,
  } = builder;
  const options = useOptions();

  const getContext = useCallback(() => ({
    element,
    parent,
  }), [element, parent]);

  const onDelete_ = e => {
    e?.preventDefault();
    removeElement(element, { parent });
  };

  const onDuplicate_ = e => {
    e?.preventDefault();
    duplicateElement(element, { parent });
  };

  const onDrop_ = (data, position) => {
    moveElement?.(data, element, { parent, position });
  };

  const onEdit_ = e => {
    e?.preventDefault();
    editableRef.current?.toggle();
  };

  const onEditableToggle_ = ({ opened }) => {
    setEditableOpened(opened);
  };

  const onCopy_ = e => {
    e?.preventDefault();
    copyToClipboard(JSON.stringify(element));
  };

  const component = getComponent(element.type) ||
    COMPONENT_DEFAULT;

  const rendered = component?.render?.({
    element,
    component,
    parent,
    builder,
    className: classNames('oak-element-content-inner', element.className),
  }) || null;

  const componentProps = [
    ...component.settings?.fields || [],
    ...options?.settings?.fields || [],
  ].filter(f =>
    f.displayable === true && (!f.condition || f.condition(element))
  ) || [];

  return (
    <ElementContext.Provider value={getContext()}>
      <Droppable
        ref={elementInnerRef}
        disabled={element.type === 'row' || element.type === 'foldable'}
        onDrop={onDrop_}
      >
        <Draggable
          data={element}
          disabled={element.type === 'row' || element.type === 'foldable'}
        >
          <div
            id={element.id || uuid()}
            className={classNames(
              'oak-element',
              'oak-' + element.type,
              className
            )}
          >
            { ['row', 'col', 'foldable'].includes(element.type) ? (
              <div className="oak-inner">
                { rendered }
              </div>
            ) : (
              <div className="oak-inner oak-with-info">
                <div className="oak-element-icon">
                  { typeof component?.icon === 'function'
                    ? component.icon({ component, className: 'oak-icons' })
                    : <Icon>{ component?.icon }</Icon>
                  }
                </div>
                <div className="oak-element-info">
                  <div className="oak-element-type">
                    <Text>{ component?.name }</Text>
                  </div>
                  <div className="oak-element-content">
                    { rendered }
                  </div>
                  { componentProps.length > 0 && (
                    <div className="oak-element-props">
                      { componentProps.map((field, i) => (
                        <Fragment key={i}>
                          <Property field={field} />
                          { i < componentProps.length - 1 && (
                            <Text name="core.propertySeparator" default=", " />
                          ) }
                        </Fragment>
                      )) }
                    </div>
                  ) }
                </div>
              </div>
            ) }

            <div
              className={classNames('oak-options', { opened: editableOpened })}
            >
              <Option
                option={{ icon: 'clear' }}
                className="oak-remove"
                onClick={onDelete_}
                name={<Text name="core.tooltips.remove" default="Remove" />}
              />
              <Option
                option={{ icon: 'content_copy' }}
                className="oak-duplicate"
                onClick={onDuplicate_}
                name={(
                  <Text name="core.tooltips.duplicate" default="Duplicate" />
                )}
              />
              <Option
                option={{ icon: 'content_paste' }}
                className="oak-copy"
                onClick={onCopy_}
                name={<Text name="core.tooltips.copy" default="Copy" />}
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
                  onToggle={onEditableToggle_}
                >
                  <Option
                    option={{ icon: 'edit' }}
                    className="oak-edit"
                    onClick={onEdit_}
                    name={<Text name="core.tooltips.edit" default="Edit" />}
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
