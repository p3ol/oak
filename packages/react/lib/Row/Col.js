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
        'oak-col',
        {
          ['oak-col-' + element.size]: element.size && element.size !== 'fluid',
        },
        className
      )}
    >
      <div className="oak-col-wrapper">
        <div className="oak-divider oak-prepend">
          <Tooltip
            placement="right"
            container={rootRef?.current || '.oak'}
            text={<Text name="core.tooltips.addColumn" default="Add column" />}
          >
            <a href="#" draggable={false} onClick={onPrependCol_}>
              <Icon className="oak-append-icon">add</Icon>
            </a>
          </Tooltip>
        </div>
        <Droppable disabled={element.content.length > 0} onDrop={onDrop_}>
          <div className="oak-col-inner">
            { element.content.length > 0 && (
              <Catalogue
                ref={prependCatalogueRef}
                onAppend={onPrepend_}
                onPaste={onPasteBefore_}
              />
            ) }

            { element.content?.length > 0 && (
              <div className="oak-col-content">
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
            />
          </div>
        </Droppable>
        <div className="oak-divider oak-append">
          <Tooltip
            placement="left"
            container={rootRef?.current || '.oak'}
            text={<Text name="core.tooltips.addColumn" default="Add column" />}
          >
            <a href="#" draggable={false} onClick={onAppendCol_}>
              <Icon className="oak-append-icon">add</Icon>
            </a>
          </Tooltip>
        </div>

        <div className="oak-options">
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

      <div ref={settingsElementRef} />
    </div>
  );
};

export default Col;
