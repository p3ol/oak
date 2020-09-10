import React, { useContext, useRef } from 'react';

import { AppContext } from '../../contexts';
import Element from '../Element';
import Catalogue from '../Catalogue';

import styles from './index.styl';

export default () => {
  const catalogueRef = useRef();
  const catalogueToggleRef = useRef();
  const { content = [], addElement } = useContext(AppContext);

  const openCatalogue = e => {
    e.preventDefault();
    catalogueRef.current?.open(catalogueToggleRef.current);
  };

  return (
    <div className={styles.builder}>
      { content.map((item, i) => (
        <Element key={i} { ...item } />
      )) }

      <a
        ref={catalogueToggleRef}
        className={styles.addElement}
        onClick={openCatalogue}
      />
      <Catalogue ref={catalogueRef} />
    </div>
  );
};
