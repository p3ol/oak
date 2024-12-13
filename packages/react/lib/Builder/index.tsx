import {
  type RefObject,
  type FormEvent,
  useCallback,
  useRef,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import {
  classNames,
  ensureNode,
} from '@junipero/react';
import {
  type ElementObject,
  type BuilderOptions,
  type ComponentSettingsFieldObject,
  type ComponentObject,
  Builder as CoreBuilder,
} from '@oakjs/core';

import type {
  EditableType,
  ImageUploadCallbackResult,
  ReactAddonObject,
  SpecialComponentPropsWithRef,
  OakRef,
} from '../types';
import { type BuilderContextValue, BuilderContext } from '../contexts';
import { useRootBuilder } from '../hooks';
import Element from '../Element';
import Catalogue, { type CatalogueRef } from '../Catalogue';
import HistoryButtons from './HistoryButtons';

export declare interface BuilderRef extends OakRef {
  builder: CoreBuilder;
  content: Array<ElementObject>;
  catalogueRef: RefObject<CatalogueRef>;
  innerRef: RefObject<HTMLDivElement>;
  close?: () => void
}

export declare interface BuilderProps
  extends SpecialComponentPropsWithRef<any, BuilderRef> {
  activeTextSheet?: string;
  addons: Array<ReactAddonObject>;
  bottomHistoryButtonsContainer?: string | HTMLElement | DocumentFragment;
  bottomHistoryButtonsEnabled?: boolean;
  defaultValue?: Array<ElementObject>;
  historyEnabled?: boolean;
  editableType?: EditableType;
  options?: Partial<BuilderOptions>;
  rootBoundary?: RefObject<any> | string | Element | DocumentFragment;
  topHistoryButtonsContainer?: string | HTMLElement | DocumentFragment;
  topHistoryButtonsEnabled?: boolean;
  value?: Array<ElementObject>;
  polyfills?: {
    DOMParser: typeof DOMParser;
    XMLSerializer: typeof XMLSerializer;
  };
  onChange?(content: Array<ElementObject>): void;
  onImageUpload?(event: FormEvent, opts: {
    element?: ElementObject;
    setting?: ComponentSettingsFieldObject;
  }): ImageUploadCallbackResult | Promise<ImageUploadCallbackResult>;
}

const Builder = ({
  ref,
  className,
  defaultValue,
  value,
  addons: addonsProp,
  rootBoundary,
  onChange,
  onImageUpload,
  topHistoryButtonsContainer,
  bottomHistoryButtonsContainer,
  polyfills,
  historyEnabled = true,
  topHistoryButtonsEnabled = true,
  bottomHistoryButtonsEnabled = true,
  ...opts
}: BuilderProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const catalogueRef = useRef<CatalogueRef>(null);
  const floatingsRef = useRef<HTMLDivElement>(null);
  const {
    builder,
    content,
    addons,
    canUndo,
    canRedo,
    editableType,
  } = useRootBuilder({
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
    rootBoundary: (rootBoundary as RefObject<any>)?.current
      ? rootBoundary : { current: rootBoundary },
    onImageUpload,
    rootRef: innerRef,
    floatingsRef,
    editableType,
    polyfills,
  }), [
    builder, content, addons, rootBoundary, onImageUpload, polyfills,
    editableType,
  ]);

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
};

Builder.displayName = 'Builder';

export default Builder;
