import React, { useContext, useRef, useReducer } from 'react';
import { classNames, mockState } from '@poool/junipero-utils';

import { AppContext } from '../../contexts';
import Element from '../Element';
import Catalogue from '../Catalogue';

import styles from './index.styl';

export default () => {
  const catalogueRef = useRef();
  const catalogueToggleRef = useRef();
  const { content = [], addElement } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    catalogueOpened: false,
  });

  const openCatalogue = e => {
    e.preventDefault();
    if (catalogueRef.current?.opened) {
      return catalogueRef.current?.close();
    }

    catalogueRef.current?.open(catalogueToggleRef.current);
  };

  const onCatalogueToggle = ({ opened }) =>
    dispatch({ catalogueOpened: opened });

  const onAppend = component => {
    addElement(component.construct());
    catalogueRef.current?.close();
  };

  return (
    <div className={styles.builder}>
      { content.map((item, i) => (
        <Element key={i} { ...item } />
      )) }

      <div className={styles.addElement}>
        <a
          ref={catalogueToggleRef}
          className={classNames(
            styles.handle,
            { [styles.opened]: state.catalogueOpened }
          )}
          onClick={openCatalogue}
        />
        <Catalogue
          className={styles.catalogue}
          ref={catalogueRef}
          onToggle={onCatalogueToggle}
          onAppend={onAppend}
        />
      </div>
    </div>
  );
};
