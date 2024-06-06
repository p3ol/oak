import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import type { BuilderProps, BuilderRef } from '../lib/Builder';
import { BuilderContext } from '../lib/contexts';
import { useRootBuilder } from '../lib/hooks';
import Element from '../lib/Element';

export const BuilderLite = forwardRef<BuilderRef, BuilderProps>(({
  children,
  ...opts
}, ref) => {
  const innerRef = useRef();
  const { content, builder } = useRootBuilder(opts);

  useImperativeHandle(ref, () => ({
    builder,
    content,
    isOak: true,
    innerRef,
    catalogueRef: innerRef,
  }));

  const getContext = useCallback(() => ({
    builder,
    content,
    rootRef: innerRef,
    rootBoundary: innerRef,
    floatingsRef: innerRef,
  }), [builder, content]);

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
});
