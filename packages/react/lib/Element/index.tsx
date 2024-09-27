import type {
  ComponentObject,
  ComponentOverride,
  ComponentOverrideObject,
  ElementObject,
  FieldOverrideObject,
} from '@oakjs/core';
import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type MutableRefObject,
  Fragment,
  forwardRef,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  useCallback,
} from 'react';
import {
  type DroppableRef,
  type ModalRef,
  Draggable,
  Droppable,
  Tooltip,
  classNames,
} from '@junipero/react';

import type { EditableRef } from '../Editable';
import type { OakRef, ReactComponentObject } from '../types';
import { copyToClipboard } from '../utils';
import { useBuilder } from '../hooks';
import DisplayableSettings from '../DisplayableSettings';
import Icon from '../Icon';
import Option from '../Option';
import Text from '../Text';
import Editable from '../Editable';

export interface ElementProps extends ComponentPropsWithoutRef<any> {
  element?: ElementObject;
  parent?: ElementObject[];
  parentComponent?: ComponentObject;
  className?: string;
  depth?: number;
}

export interface ElementRef extends OakRef {
  innerRef: MutableRefObject<DroppableRef>;
}

const Element = forwardRef<ElementRef, ElementProps>(({
  element,
  parent,
  parentComponent,
  className,
  depth = 0,
}, ref) => {
  const innerRef = useRef<DroppableRef>();
  const editableRef = useRef<EditableRef>();
  const modalRef = useRef<ModalRef>();
  const [editableOpened, setEditableOpened] = useState(false);
  const { builder, addons } = useBuilder();

  useImperativeHandle(ref, () => ({
    innerRef,
    isOak: true,
  }));

  const component = useMemo<ReactComponentObject>(() => (
    builder.getComponent(element?.type)
  ), [element?.type, addons]);
  const override = useMemo(() => (
    builder.getOverride('component', element?.type)
  ), [element?.type, builder, addons]);
  const parentOverride = useMemo(() => (
    builder.getOverride('component', parentComponent?.id) as ComponentOverride
  ), [parentComponent, builder, addons]);

  const onDelete_ = (e: MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault();
    builder.removeElement(element.id as string, { parent });
  };

  const onDuplicate_ = (e: MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault();
    builder.duplicateElement(element, { parent });
  };

  const onDrop_ = useCallback((data: any, position: ('before' | 'after')) => {
    if (
      parentComponent?.disallow?.includes?.(data.type) ||
      parentOverride?.disallow?.includes?.(data.type)
    ) {
      return;
    }

    builder.moveElement?.(data, element, { parent, position });
  }, [builder, element, parent, parentComponent, parentOverride]);

  const onPrintDebug = (e: MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault();
    // eslint-disable-next-line no-console
    console.log('Component', component, '\nElement', element,
      '\nOverride', override, '\nParent', parent);
  };

  const onCopy_ = (e: MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault();
    copyToClipboard(JSON.stringify(element));
  };

  const rendered = (
    (override as ComponentOverrideObject)?.render ||
    component?.render
  )?.({
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
          { component?.hasCustomInnerContent && !element.collapsed
            ? rendered : component ? (
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
                    'element-info oak-flex-auto oak-flex oak-flex-col',
                    'oak-gap-2 oak-justify-between'
                  )}
                >
                  <h6 className="junipero oak-m-0">
                    <Text>{ component?.name as string }</Text>
                  </h6>
                  { rendered && (
                    <div className="element-content oak-flex-auto">
                      { rendered }
                    </div>
                  ) }

                  <DisplayableSettings
                    element={element}
                    component={component}
                    override={override as ComponentOverrideObject}
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
              { 'oak-has-inner-content': component?.hasCustomInnerContent },
              { opened: editableOpened }
            )}
          >
            <Option
              option={{ icon: 'close' }}
              className="remove"
              onClick={onDelete_}
              name={<Text name="core.tooltips.remove">Remove</Text> }
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
            { (
              (override as ComponentOverrideObject)?.editable ??
              component?.editable
            ) && (
              <Editable
                element={element}
                component={component}
                ref={editableRef}
                modalRef={modalRef}
                setOpened={setEditableOpened}
                opened={editableOpened}
              >
                <Option
                  option={{ icon: 'pen' }}
                  className="edit"
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
});

Element.displayName = 'Element';

export default Element;
