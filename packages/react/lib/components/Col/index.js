import { useRef, useMemo } from 'react';
import { Droppable, Tooltip, classNames } from '@junipero/react';

import { useBuilder } from '../../hooks';
import Catalogue from '../../Catalogue';
import Option from '../../Option';
import Element from '../../Element';
import Editable from '../../Editable';
import Icon from '../../Icon';
import Text from '../../Text';

const Col = ({
  element,
  className,
  depth = 0,
  onPrepend,
  onAppend,
  onRemove,
  ...rest
}) => {
  const editableRef = useRef();
  const prependCatalogueRef = useRef();
  const appendCatalogueRef = useRef();
  const { builder, floatingsRef } = useBuilder();
  const component = useMemo(() => (
    builder.getComponent?.(element.type)
  ), [element.type]);

  const onPrependCol_ = e => {
    e.preventDefault();
    onPrepend?.();
  };

  const onAppendCol_ = e => {
    e.preventDefault();
    onAppend?.();
  };

  const onRemove_ = e => {
    e.preventDefault();
    onRemove?.();
  };

  const onEdit_ = e => {
    e.preventDefault();
    editableRef.current?.toggle();
  };

  const onPrepend_ = component => {
    prependCatalogueRef.current?.close();
    builder.addElement?.({}, {
      parent: element.content,
      position: 'before',
      component,
    });
  };

  const onAppend_ = component => {
    appendCatalogueRef.current?.close();
    builder.addElement?.({}, {
      parent: element.content,
      position: 'after',
      component,
    });
  };

  const onDrop_ = data => {
    if (component?.disallow?.includes?.(data.type)) {
      return;
    }

    builder.moveElement?.(data, element, {
      parent: element.content,
      position: 'after',
    });
  };

  const onPasteBefore_ = elmt => {
    prependCatalogueRef.current?.close();
    builder.addElements([].concat(elmt || []), {
      parent: element.content,
      position: 'before',
      resetIds: true,
    });
  };

  const onPasteAfter_ = elmt => {
    appendCatalogueRef.current?.close();
    builder.addElements([].concat(elmt || []), {
      parent: element.content,
      position: 'after',
      resetIds: true,
    });
  };

  return (
    <div
      { ...rest }
      className={classNames(
        'column',
        {
          'oak-flex-none': element.size === 'auto',
          'oak-flex-1': !element.size || element.size === 'fluid',
          'oak-basis-full': element.size === 12,
          [`oak-basis-${element.size}/12`]: Number.isInteger(element.size) &&
            element.size > 0 &&
            element.size < 12,
        },
        'oak-flex oak-max-w-full oak-items-center oak-gap-2 oak-py-2',
        className
      )}
    >
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

      <Droppable disabled={element.content.length > 0} onDrop={onDrop_}>
        <div
          className="col-inner oak-flex-auto oak-flex oak-flex-col oak-gap-2"
        >
          { element.content.length > 0 && (
            <Catalogue
              component={component}
              ref={prependCatalogueRef}
              onAppend={onPrepend_}
              onPaste={onPasteBefore_}
              className="oak-inline-flex oak-self-center small"
            />
          ) }

          { element.content?.length > 0 && (
            <div className="col-content oak-flex oak-flex-col oak-gap-4">
              { element.content?.map((item, i) => (
                <Element
                  depth={depth + 1}
                  key={item.id || i}
                  index={i}
                  parent={element.content}
                  element={item}
                  parentComponent={component}
                />
              )) }
            </div>
          ) }

          <Catalogue
            ref={appendCatalogueRef}
            component={component}
            onAppend={onAppend_}
            onPaste={onPasteAfter_}
            className={classNames(
              'oak-inline-flex oak-self-center',
              { small: element.content?.length > 0 }
            )}
          />
        </div>
      </Droppable>

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
          <Editable
            ref={editableRef}
            element={element}
            component={component}
            container={floatingsRef.current}
          >
            <Option
              className="edit"
              option={{ icon: 'pen' }}
              onClick={onEdit_}
              name={<Text name="core.tooltips.edit" default="Edit" />}
            />
          </Editable>
          <Option
            className="remove"
            option={{ icon: 'close' }}
            onClick={onRemove_}
            name={<Text name="core.tooltips.remove" default="Remove" />}
          />
        </div>
      ) }
    </div>
  );
};

Col.displayName = 'Col';

export default Col;
