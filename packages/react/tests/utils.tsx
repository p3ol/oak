import { RefObject, useCallback, useImperativeHandle, useRef } from 'react';

import type { BuilderProps } from '../lib/Builder';
import type { CatalogueRef } from '../lib';
import { type BuilderContextValue, BuilderContext } from '../lib/contexts';
import { useRootBuilder } from '../lib/hooks';
import Element from '../lib/Element';

export const BuilderLite = ({
  ref,
  children,
  catalogueEnabled = true,
  ...opts
}: BuilderProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const { content, builder } = useRootBuilder(opts);

  useImperativeHandle(ref, () => ({
    builder,
    content,
    isOak: true,
    innerRef,
    catalogueRef: null as RefObject<CatalogueRef>, // don't know
  }));

  const getContext = useCallback((): BuilderContextValue => ({
    builder,
    content,
    rootRef: innerRef,
    rootBoundary: innerRef,
    floatingsRef: innerRef,
    catalogueEnabled,
  }), [builder, content, catalogueEnabled]);

  return (
    <div ref={innerRef}>
      <BuilderContext.Provider value={getContext()}>
        { opts?.withContent && content?.map((element, i) => (
          <Element
            key={element.id || i}
            index={i}
            element={element}
          />
        )) }
        { children }
      </BuilderContext.Provider>
    </div>
  );
};
