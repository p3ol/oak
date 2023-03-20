import { useRef } from 'react';
import { Droppable, Tooltip, classNames } from '@junipero/react';

import { useBuilder } from '../hooks';
import Catalogue from '../Catalogue';
// import Option from '../Option';
import Element from '../Element';
// import Editable from '../Editable';
// import settings from './index.settings';
import Icon from '../Icon';
import Text from '../Text';

const Col = ({
  element,
  className,
  onPrepend,
  onAppend,
  onRemove,
  ...rest
}) => {
  const editableRef = useRef();
  const prependCatalogueRef = useRef();
  const appendCatalogueRef = useRef();
  const settingsElementRef = useRef();
  const { builder, rootRef } = useBuilder();

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

    const elmt = component.construct?.() || {};
    builder.addElement?.({
      ...elmt,
      content: typeof elmt.content === 'function'
        ? elmt.content(builder.getText) : elmt.content,
    }, { parent: element.content, position: 'before' });
  };

  const onAppend_ = component => {
    appendCatalogueRef.current?.close();

    const elmt = component.construct?.() || {};
    builder.addElement?.({
      ...elmt,
      content: typeof elmt.content === 'function'
        ? elmt.content(builder.getText) : elmt.content,
    }, { parent: element.content, position: 'after' });
  };

  const onDrop_ = data => {
    builder.moveElement?.(data, element, {
      parent: element.content,
      position: 'after',
    });
  };

  const onPasteBefore_ = elmt => {
    prependCatalogueRef.current?.close();
    builder.addElement(elmt, {
      parent: element.content,
      position: 'before',
      resetIds: true,
    });
  };

  const onPasteAfter_ = elmt => {
    appendCatalogueRef.current?.close();
    builder.addElement(elmt, {
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
          [`oak-basis-${element.size}/12`]: Number.isInteger(element.size) &&
            element.size > 0 &&
            element.size <= 12,
        },
        'oak-flex oak-items-center oak-gap-2 oak-py-4',
        className
      )}
    >
      <Tooltip
        placement="right"
        container={rootRef?.current || '.oak'}
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
              ref={prependCatalogueRef}
              onAppend={onPrepend_}
              onPaste={onPasteBefore_}
              className="oak-flex oak-justify-center"
            />
          ) }

          { element.content?.length > 0 && (
            <div className="col-content">
              { element.content?.map((item, i) => (
                <Element
                  key={item.id || i}
                  index={i}
                  parent={element.content}
                  element={item}
                />
              )) }
            </div>
          ) }

          <Catalogue
            ref={appendCatalogueRef}
            onAppend={onAppend_}
            onPaste={onPasteAfter_}
            className="oak-flex oak-justify-center"
          />
        </div>
      </Droppable>

      <Tooltip
        placement="left"
        container={rootRef?.current || '.oak'}
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

      <div className="options">
        {/* <Editable
          ref={editableRef}
          element={element}
          component={{ settings }}
          container={settingsElementRef}
        >
          <Option
            className="oak-edit"
            option={{ icon: 'edit' }}
            onClick={onEdit_}
            name={<Text name="core.tooltips.edit" default="Edit" />}
          />
        </Editable>
        <Option
          className="oak-remove"
          option={{ icon: 'clear' }}
          onClick={onRemove_}
          name={<Text name="core.tooltips.remove" default="Remove" />}
        /> */}
      </div>
    </div>
  );
};

export default Col;
