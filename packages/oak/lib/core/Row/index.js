import React, { useRef, useContext } from 'react';
import { classNames } from '@poool/junipero-utils';

import { AppContext } from '../../contexts';
import Catalogue from '../Catalogue';
import Element from '../Element';

import styles from './index.styl';

export default ({ className, cols = [] }) => {
  const catalogueRef = useRef();
  const { addElement, removeElement } = useContext(AppContext);

  const onAppend = (col, component) => {
    addElement(component.construct(), col.content);
    catalogueRef.current?.close();
  };

  return (
    <div className={classNames(className, styles.row)}>
      { cols.map((col, i) => (
        <div className={styles.col} key={i}>
          <div className={styles.content}>
            { col.content?.map((item, i) => (
              <Element
                key={i}
                { ...item }
                className={styles.element}
                onDelete={removeElement.bind(null, item, col.content)}
              />
            )) }
          </div>

          <div className={styles.addElement}>
            <Catalogue
              className={styles.catalogue}
              ref={catalogueRef}
              onAppend={onAppend.bind(null, col)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
