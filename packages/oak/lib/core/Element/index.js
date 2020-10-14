import React from 'react';
import { classNames } from '@poool/junipero-utils';

import { COMPONENT_DEFAULT } from '../../components';
import { useBuilder, useOptions } from '../../hooks';
import Option from '../Option';

import styles from './index.styl';

const Element = ({
  element,
  className,
  onDelete = () => {},
}) => {
  const { renderers } = useBuilder();
  const { debug } = useOptions();

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
        className,
      )}
    >
      { component?.render?.({
        element,
        className: classNames(styles.inner, element.className),
      }) || null }

      <div className={styles.options}>
        <Option
          option={{ icon: 'close' }}
          className={classNames(styles.option, styles.remove)}
          onClick={onDelete_}
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

      { debug && (
        <pre>
          <p>Element:</p>
          { JSON.stringify(element, null, 2) }
        </pre>
      )}
    </div>
  );
};

export default Element;
