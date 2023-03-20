import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { classNames } from '@junipero/react';

import { BuilderContext } from '../contexts';
import { useRootBuilder } from '../hooks';
import Element from '../Element';

const Builder = forwardRef(({ className, addons }, ref) => {
  const { builder, content } = useRootBuilder({ addons });

  useImperativeHandle(ref, () => ({
    builder,
    content,
  }));

  const getContext = useCallback(() => ({
    builder,
    content,
  }), [builder, content]);

  return (
    <BuilderContext.Provider value={getContext()}>
      <div className={classNames('oak builder', className)}>
        { content.map((element, i) => (
          <Element
            key={element.id || i}
            index={i}
            element={element}
          />
        )) }
      </div>
    </BuilderContext.Provider>
  );
});

Builder.displayName = 'Builder';

export default Builder;
