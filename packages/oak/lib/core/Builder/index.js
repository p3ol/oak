import { useRef } from 'react';
import { Button } from '@poool/junipero';

import { useOptions, useBuilder } from '../../hooks';
import Element from '../Element';
import Catalogue from '../Catalogue';

export default () => {
  const catalogueRef = useRef();
  const {
    components,
    content,
    addElement,
    _setSettingsHolderRef,
    undo,
    redo,
  } = useBuilder();
  const { debug } = useOptions();

  const onAppend = component => {
    addElement(component.construct());
    catalogueRef.current?.close();
  };

  return (
    <div className="oak-builder">
      <Button onClick={undo}>undo</Button>
      <Button onClick={redo}>redo</Button>
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

      <div ref={_setSettingsHolderRef} />

      { debug && (
        <pre>
          <p>Content:</p>
          { JSON.stringify(content, null, 2) }

          <p>Components:</p>
          { JSON.stringify(components, null, 2) }
        </pre>
      )}
    </div>
  );
};
