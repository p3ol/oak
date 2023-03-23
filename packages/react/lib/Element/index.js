import { Fragment, useMemo, useRef, useState } from 'react';
import { Draggable, Droppable, classNames } from '@junipero/react';

import { copyToClipboard } from '../utils';
import { useBuilder } from '../hooks';
import Icon from '../Icon';
import Text from '../Text';
import Option from '../Option';
import Editable from '../Editable';

const Element = ({ element, parent, className }) => {
  const { builder } = useBuilder();
  const innerRef = useRef();
  const editableRef = useRef();
  const [editableOpened, setEditableOpened] = useState(false);
  const component = useMemo(() => (
    builder.getComponent(element?.type)
  ), [element?.type]);

  const onDelete_ = e => {
    e?.preventDefault();
    builder.removeElement(element, { parent });
  };

  const onDuplicate_ = e => {
    e?.preventDefault();
    builder.duplicateElement(element, { parent });
  };

  const onDrop_ = (data, position) => {
    builder.moveElement?.(data, element, { parent, position });
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

  const rendered = component?.render?.({
    element,
    component,
    parent,
    builder,
    className: element.className,
  }) || null;

  return (
    <Droppable
      ref={innerRef}
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
                <div className="junipero !oak-text-3xl oak-bold">
                  <Text>{ component?.name }</Text>
                </div>
                <div className="element-content">
                  { rendered }
                </div>
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

          <div
            className={classNames(
              'options oak-flex oak-items-center',
              { opened: editableOpened }
            )}
          >
            <Option
              option={{ icon: 'close' }}
              className="remove"
              onClick={onDelete_}
              name={<Text name="core.tooltips.remove">Remove</Text>}
            />
            <Option
              option={{ icon: 'copy' }}
              className="duplicate"
              onClick={onDuplicate_}
              name={(
                <Text name="core.tooltips.duplicate">Duplicate</Text>
              )}
            />
            <Option
              option={{ icon: 'copy_file' }}
              className="copy"
              onClick={onCopy_}
              name={<Text name="core.tooltips.copy">Copy</Text>}
            />
            { component?.options?.map((o, i) => (
              <Fragment key={i}>
                { o?.render?.({
                  option: o,
                  className: 'option',
                  element,
                  elementInnerRef: innerRef,
                  editableRef,
                  parent,
                  component,
                  builder,
                  index: i,
                }) }
              </Fragment>
            )) }
            { component?.editable && (
              <Editable
                element={element}
                component={component}
                ref={editableRef}
                onToggle={onEditableToggle_}
              >
                <Option
                  option={{ icon: 'pen' }}
                  className="oak-edit"
                  onClick={onEdit_}
                  name={<Text name="core.tooltips.edit">Edit</Text>}
                />
              </Editable>
            ) }
          </div>
        </div>
      </Draggable>
    </Droppable>
  );
};

Element.displayName = 'Element';

export default Element;
