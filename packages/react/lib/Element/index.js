import { Fragment, useMemo, useRef, useState } from 'react';
import { Draggable, Droppable, Tooltip, classNames } from '@junipero/react';

import { copyToClipboard } from '../utils';
import { useBuilder } from '../hooks';
import Icon from '../Icon';
import Text from '../Text';
import Option from '../Option';
import Editable from '../Editable';
import DisplayableSettings from '../DisplayableSettings';

const Element = ({
  element,
  parent,
  parentComponent,
  className,
  depth = 0,
}) => {
  const innerRef = useRef();
  const editableRef = useRef();
  const [editableOpened, setEditableOpened] = useState(false);
  const { builder, addons } = useBuilder();
  const component = useMemo(() => (
    builder.getComponent(element?.type)
  ), [element?.type, addons]);
  const override = useMemo(() => (
    builder.getOverride('component', element?.type)
  ), [element?.type, addons]);

  const onDelete_ = e => {
    e?.preventDefault();
    builder.removeElement(element.id, { parent });
  };

  const onDuplicate_ = e => {
    e?.preventDefault();
    builder.duplicateElement(element, { parent });
  };

  const onDrop_ = (data, position) => {
    if (parentComponent?.disallow?.includes?.(data.type)) {
      return;
    }

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

  const onPrintDebug = e => {
    e?.preventDefault();
    // eslint-disable-next-line no-console
    console.log('Component', component, '\nElement', element,
      '\nOverride', override, '\nParent', parent);
  };

  const rendered = (override?.render || component?.render)?.({
    element,
    component,
    parentComponent,
    parent,
    builder,
    depth,
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
        disabled={component?.draggable === false || editableOpened}
      >
        <div
          className={classNames(
            'oak element oak-flex-none',
            'type-' + (component?.id || 'unknown'),
            className
          )}
        >
          { component?.hasCustomInnerContent ? rendered : component ? (
            <div
              className={classNames(
                'inner oak-flex oak-gap-2 oak-p-4 oak-items-stretch',
                depth % 2 === 0 ? 'even' : 'odd',
              )}
            >
              <Icon
                children={typeof component?.icon === 'function'
                  ? component.icon.bind(null, component)
                  : component?.icon}
              />
              <div
                className={classNames(
                  'element-info oak-flex-auto oak-flex oak-flex-col oak-gap-2',
                  'oak-justify-between'
                )}
              >
                <h6 className="junipero oak-m-0">
                  <Text>{ component?.name }</Text>
                </h6>
                { rendered && (
                  <div className="element-content oak-flex-auto">
                    { rendered }
                  </div>
                ) }

                <DisplayableSettings
                  element={element}
                  component={component}
                  override={override}
                />
              </div>
            </div>
          ) : (
            <div
              className={classNames(
                'inner oak-flex oak-gap-2 oak-p-4',
                depth % 2 === 0 ? 'even' : 'odd'
              )}
            >
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
            { (component?.options || []).map((o, i) => (
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
                  className="edit"
                  onClick={onEdit_}
                  name={<Text name="core.tooltips.edit">Edit</Text>}
                />
              </Editable>
            ) }
          </div>
          { builder.options.debug && (
            <Tooltip
              className="extra"
              text="Print debug in console"
              placement="left"
            >
              <span className="debug oak-cursor-pointer" onClick={onPrintDebug}>
                <Icon
                  className="!oak-text-sm !oak-text-alternate-text-color"
                >
                  settings
                </Icon>
              </span>
            </Tooltip>
          ) }
        </div>
      </Draggable>
    </Droppable>
  );
};

Element.displayName = 'Element';

export default Element;
