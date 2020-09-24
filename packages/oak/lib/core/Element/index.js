import React from 'react';
import { classNames } from '@poool/junipero-utils';

import styles from './index.styl';

const Element = ({
  id,
  name,
  type,
  className,
  render = () => {},
  onDelete = () => {},
  ...props
}) => {
  const onDelete_ = e => {
    e.preventDefault();
    onDelete();
  };

  return (
    <div
      className={classNames(
        styles.element,
        styles[type],
        className,
      )}
    >
      { render({
        ...props,
        className: classNames(styles.inner, props.className),
      }) || null }

      <div className={styles.options}>
        <a
          href="#"
          className={classNames(styles.option, styles.remove)}
          onClick={onDelete_}
        >
          <i className="material-icons">close</i>
        </a>
      </div>
    </div>
  );
};

export default Element;
