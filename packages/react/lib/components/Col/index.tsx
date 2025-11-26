import type {
  ComponentObject,
  ComponentOverride,
  ComponentOverrideObject,
  ElementObject,
} from '@oakjs/core';
import {
  type ComponentPropsWithoutRef,
  type Key,
  type MouseEvent,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { type ModalRef, Droppable, Tooltip, classNames } from '@junipero/react';

import { useBuilder } from '../../hooks';
import Catalogue, { type CatalogueRef } from '../../Catalogue';
import Editable, { type EditableRef } from '../../Editable';
import Element from '../../Element';
import Icon from '../../Icon';
import Option from '../../Option';
import Text from '../../Text';

export interface ColProps extends ComponentPropsWithoutRef<'div'> {
  element: ElementObject;
  parent: ElementObject[];
  parentOverride?: ComponentOverrideObject;
  depth?: number;
  onPrepend?: () => void;
  onAppend?: () => void;
  onRemove?: () => void;
}

const Col = ({
  element,
  className,
  parentOverride,
  parent = [],
  depth = 0,
  onPrepend,
  onAppend,
  onRemove,
}: ColProps) => {
  const editableRef = useRef<EditableRef>(null);
  const modalRef = useRef<ModalRef>(null);
  const prependCatalogueRef = useRef<CatalogueRef>(null);
  const appendCatalogueRef = useRef<CatalogueRef>(null);
  const {
    builder,
    floatingsRef,
    addons,
    catalogueEnabled,
  } = useBuilder();
  const component = useMemo(() => (
    builder.getComponent?.(element.type)
  ), [element.type, builder]);
  const override = useMemo(() => (
    builder.getOverride('component', element?.type) as ComponentOverride
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [builder, element?.type, addons]);

  const onPrependCol_ = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onPrepend?.();
  };

  const onAppendCol_ = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onAppend?.();
  };

  const onRemove_ = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onRemove?.();
  };

  const onPrepend_ = (component: ComponentObject) => {
    prependCatalogueRef.current?.close();
    builder.addElement?.({}, {
      parent: element.content as ElementObject[],
      position: 'before',
      component,
    });
  };

  const onAppend_ = (component: ComponentObject) => {
    appendCatalogueRef.current?.close();
    builder.addElement?.({}, {
      parent: element.content as ElementObject[],
      position: 'after',
      component,
    });
  };

  const onDrop_ = useCallback((
    data: ElementObject,
  ) => {
    if (
      component?.disallow?.includes?.(data.type) ||
      override?.disallow?.includes?.(data.type)
    ) {
      return;
    }

    builder.moveElement?.(data, element, {
      parent: element.content as ElementObject[],
      position: 'after',
    });
  }, [builder, element, component, override]);

  const onPasteBefore_ = (elmt: ElementObject) => {
    prependCatalogueRef.current?.close();
    builder.addElements([].concat(elmt || []), {
      parent: element.content as ElementObject[],
      position: 'before',
      resetIds: true,
    });
  };

  const onPasteAfter_ = (elmt: ElementObject) => {
    appendCatalogueRef.current?.close();
    builder.addElements([].concat(elmt || []), {
      parent: element.content as ElementObject[],
      position: 'after',
      resetIds: true,
    });
  };

  const canEditContainers = useMemo(() =>
    (override?.containerEditable ?? component?.containerEditable) !== false
  , [override, component]);

  return (
    <div
      className={classNames(
        'column',
        'oak-flex oak-max-w-full oak-items-center oak-gap-2',
        {
          'oak-flex-none': element.size === 'auto',
          'oak-flex-1': !element.size || element.size === 'fluid',
          'oak-basis-full': element.size === 12,
          'oak-py-8 oak-px-4': !canEditContainers,
          'oak-py-2': canEditContainers,
          [`oak-basis-${element.size}/12`]: Number.isInteger(element.size) &&
            element.size > 0 &&
            element.size < 12,
        },
        className
      )}
    >
      { canEditContainers && (
        <Tooltip
          placement="right"
          container={floatingsRef?.current || '.oak'}
          className="secondary"
          text={<Text name="core.tooltips.addColumn">Add column</Text>}
        >
          <a
            className="divider prepend oak-flex oak-items-center"
            href="#"
            draggable={false}
            onClick={onPrependCol_}
          >
            <Icon className="!oak-text-lg">add</Icon>
          </a>
        </Tooltip>
      )}

      <Droppable
        disabled={
          element.content.length > 0 ||
          (
            override?.droppable ??
            component?.droppable ??
            parentOverride?.droppable
          ) === false
        }
        onDrop={onDrop_}
      >
        <div
          className="col-inner oak-flex-auto oak-flex oak-flex-col oak-gap-2"
        >
          { element.content.length > 0 && catalogueEnabled && (
            <Catalogue
              element={element}
              component={component}
              ref={prependCatalogueRef}
              onAppend={onPrepend_}
              onPaste={onPasteBefore_}
              className="oak-inline-flex oak-self-center small"
            />
          ) }

          { element.content?.length > 0 && (
            <div className="col-content oak-flex oak-flex-col oak-gap-4">
              { (element.content as ElementObject[])?.map(
                (item: ElementObject, i: Key) => (
                  <Element
                    depth={depth + 1}
                    key={item.id || i}
                    index={i}
                    parent={element.content as ElementObject[]}
                    element={item}
                    parentComponent={component}
                  />
                )
              ) }
            </div>
          ) }

          { catalogueEnabled && (
            <Catalogue
              ref={appendCatalogueRef}
              element={element}
              component={component}
              onAppend={onAppend_}
              onPaste={onPasteAfter_}
              className={classNames(
                'oak-inline-flex oak-self-center',
                { small: element.content?.length > 0 }
              )}
            />
          )}
        </div>
      </Droppable>

      { canEditContainers && (
        <Tooltip
          placement="left"
          container={floatingsRef?.current || '.oak'}
          className="secondary"
          text={<Text name="core.tooltips.addColumn">Add column</Text>}
        >
          <a
            className="divider append oak-flex oak-items-center"
            href="#"
            draggable={false}
            onClick={onAppendCol_}
          >
            <Icon className="!oak-text-lg">add</Icon>
          </a>
        </Tooltip>
      )}

      <div className="size-info oak-absolute oak-bottom-1 oak-left-1">
        { element.size === 'auto' ? (
          <Tooltip
            className="secondary"
            text={(
              <Text name="core.tooltips.columnSize.auto">Fits content</Text>
            )}
            placement="right"
          >
            <span>
              <Icon
                className={classNames(
                  '!oak-text-alternate-text-color oak-block oak-rotate-90',
                  'oak-cursor-help'
                )}
              >
                unfold
              </Icon>
            </span>
          </Tooltip>
        ) : Number.isInteger(element.size) ? (
          <span
            className={classNames(
              'junipero extra oak-block !oak-text-alternate-text-color',
              'oak-pointer-events-none oak-user-select-none',
              'oak-pb-1 oak-pl-2'
            )}
          >
            { element.size }/12
          </span>
        ) : (
          <Tooltip
            className="secondary"
            text={(
              <Text name="core.tooltips.columnSize.fluid">
                Fills available space
              </Text>
            )}
            placement="right"
          >
            <span>
              <Icon
                className={classNames(
                  '!oak-text-alternate-text-color oak-rotate-90 oak-block',
                  'oak-cursor-help'
                )}
              >
                foldable
              </Icon>
            </span>
          </Tooltip>
        ) }
      </div>

      { component && (
        <div className="options oak-flex oak-items-center oak-gap-0.5">
          { (
            element.styles?.backgroundColor ||
            element.styles?.backgroundImage
          ) && parent.length <= 6 && (
            <div
              className={classNames(
                'oak-mr-2 oak-rounded-full oak-w-[15px]',
                'oak-h-[15px] oak-bg-no-repeat oak-bg-center oak-bg-cover',
              )}
              style={{
                backgroundColor: element.styles?.backgroundColor,
                ...element.styles?.backgroundImage && {
                  backgroundImage:
                    `url(${element.styles?.backgroundImage.url})`,
                },
              }}
            />
          )}
          { (override?.editable ?? component.editable) && (
            <Editable
              ref={editableRef}
              element={element}
              component={component}
              modalRef={modalRef}
            >
              <Option
                className="edit"
                option={{ icon: 'pen' }}
                name={<Text name="core.tooltips.edit">Edit</Text>}
              />
            </Editable>
          ) }

          { (override?.removable ?? component.removable) !== false && (
            <Option
              className="remove"
              option={{ icon: 'close' }}
              onClick={onRemove_}
              name={<Text name="core.tooltips.remove">Remove</Text>}
            />
          )}
        </div>
      ) }
    </div>
  );
};

Col.displayName = 'Col';

export default Col;
