import React from 'react';
import { classNames } from '@poool/junipero-utils';

import { COMPONENT_DEFAULT } from '../../components';
import { useBuilder, useOptions } from '../../hooks';

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
      { component?.render?.(element, {
        className: classNames(styles.inner, element.className),
      }) || null }

      <div className={styles.options}>
        <a
          href="#"
          className={classNames(styles.option, styles.remove)}
          onClick={onDelete_}
        >
          <i className="material-icons">close</i>
        </a>
        { component?.options?.map((o, i) =>
          o?.render?.(o, i, element)
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
