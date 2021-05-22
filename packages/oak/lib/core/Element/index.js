import { Fragment, useLayoutEffect, useState } from 'react';
import { classNames } from '@poool/junipero-utils';

import { COMPONENT_DEFAULT } from '../../components';
import { useBuilder } from '../../hooks';
import Option from '../Option';

import styles from './index.styl';

const Element = ({
  element,
  className,
  onDelete = () => {},
  insertElement = () => {},
}) => {
  const { renderers, addId } = useBuilder();
  const [componentRef, setComponentRef] = useState();
  const [isDragOver, setIsDragOver] = useState();

  useLayoutEffect(() => {
    addId(element);
  }, []);

  const onDelete_ = e => {
    e.preventDefault();
    onDelete();
  };

  const onDragStart_ = e => {
    e.dataTransfer.setData('text', JSON.stringify(element));
    e.dataTransfer.setDragImage(componentRef,
      componentRef.getBoundingClientRect().width / 2,
      componentRef.getBoundingClientRect().height / 2);
    setTimeout(onDelete, 0);
  };

  const onDragOver_ = e => {
    e.preventDefault();
    const targetRect = e.currentTarget.getBoundingClientRect();
    const targetMiddleY = targetRect?.top + targetRect?.height / 2;

    if (e.clientY >= targetMiddleY) {
      setIsDragOver('after');
    } else {
      setIsDragOver('before');
    }
  };

  const onDrop_ = e => {
    e.stopPropagation();
    setIsDragOver(null);
    const droppedElement = JSON.parse(e.dataTransfer.getData('text'));
    insertElement(droppedElement, element, isDragOver === 'after');
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
        className,
      )}
      onDragOver={e => onDragOver_(e)}
      onDrop={e => onDrop_(e)}
      onDragLeave={() => setIsDragOver(null)}
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
          onDragStart={e => onDragStart_(e)}
        />
        { component.options?.map((o, i) => (
          <Fragment key={i}>
            { o?.render?.({
              option: o,
              className: styles.option,
              element,
              component,
              index: i,
            }) }
          </Fragment>
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
