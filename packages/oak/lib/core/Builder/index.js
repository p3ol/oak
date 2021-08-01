import { useRef } from 'react';
import { classNames } from '@poool/junipero-utils';

import { useOptions, useBuilder } from '../../hooks';
import Element from '../Element';
import Catalogue from '../Catalogue';
import Icon from '../Icon';

export default () => {
  const catalogueRef = useRef();
  const {
    components,
    content,
    addElement,
    _setSettingsHolderRef,
    undo,
    redo,
    isUndoPossible,
    isRedoPossible,
  } = useBuilder();
  const { debug, historyButtonsEnabled } = useOptions();

  const onAppend = component => {
    addElement(component.construct?.() || {});
    catalogueRef.current?.close();
  };

  return (
    <div className="oak-builder">
      { historyButtonsEnabled !== false && (
        <div className="oak-undo-redo">
          <a onClick={() => isUndoPossible && undo()}
            className={classNames('oak-undo', !isUndoPossible && 'disabled')}
          >
            <Icon>undo</Icon>
          </a>
          <a onClick={() => isRedoPossible && redo()}
            className={classNames('oak-redo', !isRedoPossible && 'disabled')}
          >
            <Icon>redo</Icon>
          </a>
        </div>
      ) }

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
