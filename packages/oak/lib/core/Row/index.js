import React, { useRef, useContext, useEffect } from 'react';
import { classNames } from '@poool/junipero-utils';

import { AppContext } from '../../contexts';
import Catalogue from '../Catalogue';
import Element from '../Element';

import styles from './index.styl';

export default ({ className, element }) => {
  const catalogueRef = useRef();
  const { addElement, removeElement, setElement } = useContext(AppContext);

  useEffect(() => {
    if (!element.cols?.length) {
      setElement(element, { cols: [{ size: 12, content: [] }] });
    }
  }, []);

  const onAppend = (col, component) => {
    addElement(component.construct(), col.content);
    catalogueRef.current?.close();
  };

  return (
    <div className={classNames(className, styles.row)}>
      { element?.cols?.map((col, i) => (
        <div className={styles.col} key={i}>
          <div className={styles.content}>
            { col.content?.map((item, i) => (
              <Element
                key={i}
                element={item}
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
