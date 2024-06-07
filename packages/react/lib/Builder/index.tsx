import {
  type MutableRefObject,
  type FormEvent,
  type ComponentPropsWithRef,
  forwardRef,
  useCallback,
  useRef,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import { classNames, ensureNode } from '@junipero/react';
import {
  type AddonObject,
  type ElementObject,
  type BuilderOptions,
  type ComponentSettingsFieldObject,
  type ComponentObject,
  Builder as CoreBuilder,
} from '@oakjs/core';

import type { ImageUploadCallbackResult } from '../types';
import { type BuilderContextValue, BuilderContext } from '../contexts';
import { useRootBuilder } from '../hooks';
import Element from '../Element';
import Catalogue from '../Catalogue';
import HistoryButtons from './HistoryButtons';

export declare type BuilderRef = {
  builder: CoreBuilder;
  content: Array<ElementObject>;
  isOak: boolean;
  catalogueRef: MutableRefObject<any>;
  innerRef: MutableRefObject<any>;
  close?: () => void
};

export declare interface BuilderProps extends ComponentPropsWithRef<any> {
  activeTextSheet?: string;
  addons: Array<AddonObject>;
  bottomHistoryButtonsContainer?: string | HTMLElement | DocumentFragment;
  bottomHistoryButtonsEnabled?: boolean;
  defaultValue?: Array<ElementObject>;
  historyEnabled?: boolean;
  options?: BuilderOptions;
  rootBoundary?: MutableRefObject<any> | string | Element | DocumentFragment;
  topHistoryButtonsContainer?: string | HTMLElement | DocumentFragment;
  topHistoryButtonsEnabled?: boolean;
  value?: Array<ElementObject>;
  [key: string]: any;
  onChange?(content: Array<ElementObject>): void;
  onImageUpload?(event: FormEvent, opts: {
    element?: ElementObject;
    setting?: ComponentSettingsFieldObject;
  }): Promise<ImageUploadCallbackResult>;
  ref?: MutableRefObject<BuilderRef>;
}

const Builder = forwardRef<BuilderRef, BuilderProps>(({
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
}: BuilderProps, ref) => {
  const innerRef = useRef();
  const catalogueRef = useRef<any>();
  const floatingsRef = useRef<any>();
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

  const getContext = useCallback((): BuilderContextValue => ({
    builder,
    content,
    addons,
    rootBoundary: (rootBoundary as MutableRefObject<any>)?.current
      ? rootBoundary : { current: rootBoundary },
    onImageUpload,
    rootRef: innerRef,
    floatingsRef,
  }), [builder, content, addons, rootBoundary, onImageUpload]);

  const onAppend = (component: ComponentObject) => {
    catalogueRef.current?.close();
    builder.addElement({}, { component });
  };

  const onPrepend = (component: ComponentObject) => {
    catalogueRef.current?.close();
    builder.addElement({}, { component, position: 'before' });
  };

  const onPaste = (position: 'before' | 'after', element: ElementObject) => {
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

          { content?.map((element: ElementObject, i: number) => (
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
