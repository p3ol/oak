import React from 'react';

import styles from './index.styl';

const Element = ({
  id,
  name,
  type,
  render = () => {},
  ...props
}) => {
  return (
    <div className={styles.element}>
      { render(props) || null }
    </div>
  );
};

export default Element;
