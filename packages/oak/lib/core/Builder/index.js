import { useRef } from 'react';

import { useOptions, useBuilder } from '../../hooks';
import Element from '../Element';
import Catalogue from '../Catalogue';

export default () => {
  const catalogueRef = useRef();
  const {
    renderers,
    content,
    addElement,
  } = useBuilder();

  const { debug } = useOptions();

  const onAppend = component => {
    addElement(component.construct());
    catalogueRef.current?.close();
  };

  return (
    <div className="oak-builder">
      { content.map((item, i) => (
        <Element
          key={item.id || i}
          index={i}
          element={item}
        />
      )) }

      <div className="oak-add-element">
        <Catalogue ref={catalogueRef} onAppend={onAppend} />
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
