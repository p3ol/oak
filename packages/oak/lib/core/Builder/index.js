import React, { useContext, useRef, useReducer } from 'react';
import { classNames, mockState } from '@poool/junipero-utils';

import { AppContext } from '../../contexts';
import Element from '../Element';
import Catalogue from '../Catalogue';

import styles from './index.styl';

export default () => {
  const catalogueRef = useRef();
  const { content = [], addElement, removeElement } = useContext(AppContext);

  const onAppend = component => {
    addElement(component.construct());
    catalogueRef.current?.close();
  };

  return (
    <div className={styles.builder}>
      { content.map((item, i) => (
        <Element
          key={i}
          { ...item }
          onDelete={removeElement.bind(null, item)}
        />
      )) }

      <div className={styles.addElement}>
        <Catalogue
          className={styles.catalogue}
          ref={catalogueRef}
          onAppend={onAppend}
        />
      </div>
    </div>
  );
};
