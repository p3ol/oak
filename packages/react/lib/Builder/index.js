import { forwardRef, useCallback, useRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom/client';
import { Button, classNames, ensureNode } from '@junipero/react';

import { BuilderContext } from '../contexts';
import { useRootBuilder } from '../hooks';
import Element from '../Element';
import Catalogue from '../Catalogue';
import Icon from '../Icon';

const Builder = forwardRef(({
  className,
  defaultValue,
  value,
  addons,
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
  const { builder, content, canUndo, canRedo } = useRootBuilder({
    content: value,
    defaultContent: defaultValue,
    addons,
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
    rootBoundary: rootBoundary?.current
      ? rootBoundary : { current: rootBoundary },
    onImageUpload,
    rootRef: innerRef,
    floatingsRef,
  }), [builder, content, rootBoundary, onImageUpload]);

  const onAppend = component => {
    catalogueRef.current?.close();
    builder.addElement({}, { component });
  };

  const onPrepend = component => {
    catalogueRef.current?.close();
    builder.addElement({}, { component, position: 'before' });
  };

  const onPaste = element => {
    catalogueRef.current?.close();
    builder.addElement(element, { resetIds: true });
  };

  const historyButtons = (
    <div className="oak-flex oak-gap-2">
      <Button onClick={builder.undo.bind(builder)} disabled={!canUndo}>
        <Icon>undo</Icon>
      </Button>
      <Button onClick={builder.redo.bind(builder)} disabled={!canRedo}>
        <Icon>redo</Icon>
      </Button>
    </div>
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
                onPaste={onPaste}
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
              onPaste={onPaste}
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
