import { forwardRef, useCallback, useRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { classNames, ensureNode } from '@junipero/react';

import { BuilderContext } from '../contexts';
import { useRootBuilder } from '../hooks';
import Element from '../Element';
import Catalogue from '../Catalogue';
import HistoryButtons from './HistoryButtons';

const Builder = forwardRef(({
  className,
  defaultValue,
  value,
  addons: addonsProp,
  rootBoundary,
  onChange,
  onImageUpload,
  topHistoryButtonsContainer,
  bottomHistoryButtonsContainer,
  historyEnabled = true,
  topHistoryButtonsEnabled = true,
  bottomHistoryButtonsEnabled = true,
  ...opts
}, ref) => {
  const innerRef = useRef();
  const catalogueRef = useRef();
  const floatingsRef = useRef();
  const { builder, content, addons, canUndo, canRedo } = useRootBuilder({
    content: value,
    defaultContent: defaultValue,
    addons: addonsProp,
    onChange,
    ...opts,
  });

  useImperativeHandle(ref, () => ({
    builder,
    content,
    isOak: true,
    catalogueRef,
    innerRef,
  }));

  const getContext = useCallback(() => ({
    builder,
    content,
    addons,
    rootBoundary: rootBoundary?.current
      ? rootBoundary : { current: rootBoundary },
    onImageUpload,
    rootRef: innerRef,
    floatingsRef,
  }), [builder, content, addons, rootBoundary, onImageUpload]);

  const onAppend = component => {
    catalogueRef.current?.close();
    builder.addElement({}, { component });
  };

  const onPrepend = component => {
    catalogueRef.current?.close();
    builder.addElement({}, { component, position: 'before' });
  };

  const onPaste = (position, element) => {
    catalogueRef.current?.close();
    builder.addElements([].concat(element || []), { resetIds: true, position });
  };

  const historyButtons = (
    <HistoryButtons canUndo={canUndo} canRedo={canRedo} />
  );

  return (
    <BuilderContext.Provider value={getContext()}>
      <div
        ref={innerRef}
        className={classNames(
          'oak builder',
          className
        )}
      >
        { historyEnabled && topHistoryButtonsEnabled && (
          topHistoryButtonsContainer
            ? createPortal(historyButtons,
              ensureNode(topHistoryButtonsContainer))
            : historyButtons
        ) }
        <div className="elements oak-flex oak-flex-col oak-gap-4">
          { content?.length > 0 && (
            <div className="add-element oak-flex oak-justify-center">
              <Catalogue
                ref={catalogueRef}
                onAppend={onPrepend}
                onPaste={onPaste.bind(null, 'before')}
              />
            </div>
          ) }

          { content?.map((element, i) => (
            <Element
              key={element.id || i}
              index={i}
              element={element}
            />
          )) }

          <div className="add-element oak-flex oak-justify-center">
            <Catalogue
              ref={catalogueRef}
              onAppend={onAppend}
              onPaste={onPaste.bind(null, 'after')}
            />
          </div>
        </div>
        { historyEnabled && bottomHistoryButtonsEnabled && (
          bottomHistoryButtonsContainer
            ? createPortal(historyButtons,
              ensureNode(bottomHistoryButtonsContainer))
            : historyButtons
        ) }

        <div className="floatings" ref={floatingsRef} />
      </div>
    </BuilderContext.Provider>
  );
});

Builder.displayName = 'Builder';

export default Builder;
