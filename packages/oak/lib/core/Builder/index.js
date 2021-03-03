import React, { useRef } from 'react';

import { useOptions, useBuilder } from '../../hooks';
import Element from '../Element';
import Catalogue from '../Catalogue';

import styles from './index.styl';

export default () => {
  const catalogueRef = useRef();
  const {
    renderers,
    content,
    addElement,
    removeElement,
    insertElement,
  } = useBuilder();

  const { debug } = useOptions();

  const onAppend = component => {
    addElement(component.construct());
    catalogueRef.current?.close();
  };

  const onInsert = (eltToInsert, eltWhereInsert, isAfter) => {
    insertElement(eltToInsert, eltWhereInsert, isAfter, content);
  };

  return (
    <div className={styles.builder}>
      { content.map((item, i) => (
        <Element
          key={i}
          element={item}
          onDelete={removeElement.bind(null, item)}
          insertElement={onInsert}
        />
      )) }

      <div className={styles.addElement}>
        <Catalogue
          className={styles.catalogue}
          ref={catalogueRef}
          onAppend={onAppend}
        />
      </div>

      { debug && (
        <pre>
          <p>Content:</p>
          { JSON.stringify(content, null, 2) }

          <p>Renderers:</p>
          { JSON.stringify(renderers, null, 2) }
        </pre>
      )}
    </div>
  );
};
