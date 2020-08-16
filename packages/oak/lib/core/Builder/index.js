import React, { useContext } from 'react';

import { AppContext } from '../../contexts';
import Element from '../Element';

import styles from '../../theme/core/Builder.styl';

const Builder = () => {
  const { content = [] } = useContext(AppContext);

  return (
    <div className={styles.builder}>
      { content.map((item, i) => (
        <Element key={i} { ...item } />
      )) }
    </div>
  );
};

export default Builder;
