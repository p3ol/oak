import type {
  ComponentObject,
  ComponentOverride,
  ElementObject,
} from '@oakjs/core';
import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type RefObject,
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
import { type ElementContextValue, ElementContext } from '../contexts';
import { copyToClipboard } from '../utils';
import { useBuilder } from '../hooks';
import DisplayableSettings from '../DisplayableSettings';
import Icon from '../Icon';
import Option from '../Option';
import Text from '../Text';
import Editable from '../Editable';
import DynamicComponent from '../DynamicComponent';

export interface ElementRef extends OakRef {
  innerRef: RefObject<DroppableRef>;
}

export interface ElementProps extends ComponentPropsWithoutRef<any> {
  ref?: RefObject<ElementRef>;
  element?: ElementObject;
  parent?: ElementObject[];
  parentComponent?: ComponentObject;
  className?: string;
  depth?: number;
}

const Element = ({
  ref,
  element,
  parent,
  parentComponent,
  className,
  depth = 0,
}: ElementProps) => {
  const innerRef = useRef<DroppableRef>(null);
  const editableRef = useRef<EditableRef>(null);
  const modalRef = useRef<ModalRef>(null);
  const [editableOpened, setEditableOpened] = useState(false);
  const [elementCollapsed, setElementCollapsed] = useState(false);
  const { builder, addons } = useBuilder();

  useImperativeHandle(ref, () => ({
    innerRef,
    isOak: true,
  }));

  const component = useMemo<ReactComponentObject>(() => (
    builder.getComponent(element?.type)
  ), [element?.type, addons]);
  const override = useMemo(() => (
    builder.getOverride('component', element?.type) as ComponentOverride
  ), [element?.type, builder, addons]);
  const parentOverride = useMemo(() => (
    builder.getOverride('component', parentComponent?.id) as ComponentOverride
  ), [parentComponent, builder, addons]);

  const getElementContext = useCallback((): ElementContextValue => {
    return {
      element,
      collapsed: elementCollapsed,
      toggleCollapse: () => setElementCollapsed(v => !v),
    };
  }, [element, elementCollapsed, setElementCollapsed]);

  const onDelete_ = (e: MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault();
    builder.removeElement(element.id as string, { parent });
  };

  const onDuplicate_ = (e: MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault();
    builder.duplicateElement(element, { parent });
  };

  const onDrop_ = useCallback((
    data: ElementObject,
    position: 'before' | 'after',
  ) => {
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

  const unfoldBlock = useCallback((e: MouseEvent<HTMLElement>) => {
    e?.preventDefault();

    if (elementCollapsed) {
      setElementCollapsed(false);
    }
  }, [elementCollapsed, setElementCollapsed]);

  const rendered = (
    <DynamicComponent
      renderer={override?.render || component?.render}
      element={element}
      component={component}
      override={override}
      parentComponent={parentComponent}
      parent={parent}
      builder={builder}
      depth={depth}
      className={element.className}
    />
  );

  return (
    <ElementContext.Provider value={getElementContext()}>
      <Droppable
        ref={innerRef}
        onDrop={onDrop_}
        disabled={
          (override?.droppable ?? component?.droppable) === false
        }
      >
        <Draggable
          data={element}
          disabled={
            (override?.draggable ?? component?.draggable) === false ||
            editableOpened
          }
        >
          <div
            className={classNames(
              'oak element oak-flex-none',
              'type-' + (component?.id || 'unknown'),
              className
            )}
          >
            { component?.hasCustomInnerContent && !elementCollapsed
              ? rendered : component ? (
                <div
                  className={classNames(
                    'inner oak-flex oak-gap-2 oak-p-4 oak-items-stretch',
                    depth % 2 === 0 ? 'even' : 'odd',
                    { 'oak-cursor-pointer': elementCollapsed },
                  )}
                  onClick={unfoldBlock}
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
                    <div className="oak-flex oak-items-center">
                      <h6 className="junipero oak-inline oak-m-0">
                        <Text>{ component?.name as string }</Text>
                      </h6>
                      { elementCollapsed && (
                        <span
                          className={classNames(
                            'junipero extra',
                            '!oak-text-alternate-text-color oak-ml-1'
                          )}
                        >
                          <Text name="core.components.collapsed">
                            (expand to see inner content)
                          </Text>
                        </span>
                      )}
                    </div>
                    { !elementCollapsed && rendered && (
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
              { (override?.duplicable ?? component?.duplicable) && (
                <Option
                  option={{ icon: 'copy' }}
                  className="duplicate"
                  onClick={onDuplicate_}
                  name={(
                    <Text name="core.tooltips.duplicate">Duplicate</Text>
                  )}
                />
              ) }
              { (override?.copyable ?? component?.copyable) && (
                <Option
                  option={{ icon: 'copy_file' }}
                  className="copy"
                  onClick={onCopy_}
                  name={<Text name="core.tooltips.copy">Copy</Text>}
                />
              ) }
              { (component?.options || []).map((o, i) => (
                <DynamicComponent
                  renderer={o.render}
                  key={i}
                  option={o}
                  className="option"
                  element={element}
                  elementInnerRef={innerRef}
                  editableRef={editableRef}
                  parent={parent}
                  component={component}
                  builder={builder}
                  index={i}
                />
              )) }
              { (override?.editable ?? component?.editable) && (
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
                <span
                  className="debug oak-cursor-pointer"
                  onClick={onPrintDebug}
                >
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
    </ElementContext.Provider>
  );
};

Element.displayName = 'Element';

export default Element;
