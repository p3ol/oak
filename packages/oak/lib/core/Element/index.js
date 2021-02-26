import React, { useLayoutEffect, useState } from 'react';
import { classNames } from '@poool/junipero-utils';

import { COMPONENT_DEFAULT } from '../../components';
import { useOptions, useBuilder } from '../../hooks';
import Option from '../Option';

import styles from './index.styl';

const Element = ({
  element,
  className,
  onDelete = () => {},
}) => {
  const { renderers, addId } = useBuilder();
  const { debug } = useOptions();
  const [componentRef, setComponentRef] = useState();
  const [isDragOver, setIsDragOver] = useState();

  useLayoutEffect(() => {
    addId(element);
  }, []);

  const onDelete_ = e => {
    e.preventDefault();
    onDelete();
  };

  const onEdit_ = e => {
    e.preventDefault();
  };

  const component = renderers.find(r => r.id === element.type) ||
    COMPONENT_DEFAULT;

  return (
    <div
      className={classNames(
        styles.element,
        styles[element?.type],
        `${isDragOver ? styles[isDragOver] : ''}`,
        className,
      )}
      onDragOver={e => {
        const targetRect = e.currentTarget.getBoundingClientRect();
        const targetMiddleY = targetRect?.top + targetRect?.height / 2;
        const isAfter = false;

        if (e.clientY >= targetMiddleY) {
          setIsDragOver('after');
        } else {
          setIsDragOver('before');
        }
      }}
      onDrop= {e => setIsDragOver(null)}
      onDragLeave={e => setIsDragOver(null)}
      style={{ alignItems: element.style?.horizontalAlignement }}
      ref={setComponentRef}
    >
      { component?.render?.({
        element,
        className: classNames(styles.inner, element.className),
        onDelete,
      }) || null }

      <div className={styles.options}>
        <Option
          option={{ icon: 'close' }}
          className={classNames(styles.option, styles.remove)}
          onClick={onDelete_}
        />
        <Option
          draggable="true"
          option={{ icon: 'reorder' }}
          className={classNames(styles.option, styles.remove)}
          onDragStart={e => {

            e.dataTransfer.setData('text', JSON.stringify(element));
            e.dataTransfer.setDragImage(componentRef,
              componentRef.getBoundingClientRect().width / 2,
              componentRef.getBoundingClientRect().height / 2);
          }}
        />
        { component.options?.map((o, i) => (
          <React.Fragment key={i}>
            { o?.render?.({
              option: o,
              className: styles.option,
              element,
              component,
              index: i,
            }) }
          </React.Fragment>
        )) }
        { component.editable && (
          <Option
            icon={{ icon: 'edit' }}
            className={classNames(styles.option, styles.edit)}
            onClick={onEdit_}
          />
        ) }
      </div>

      {/* { debug && (
        <pre>
          <p>Element:</p>
          { JSON.stringify(element, null, 2) }
        </pre>
      )} */}
    </div>
  );
};

export default Element;
