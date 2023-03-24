import { useContext, useEffect, useMemo, useReducer } from 'react';
import { Builder } from '@oakjs/core';
import { mockState } from '@junipero/react';

import { BuilderContext } from './contexts';

export const useRootBuilder = opts => {
  const builder = useMemo(() => (
    new Builder(opts)
  ), []);
  const [state, dispatch] = useReducer(mockState, {
    content: builder.getContent(),
  });

  useEffect(() => {
    const unsubscribe = builder.subscribe((eventName, ...args) => {
      switch (eventName) {
        case 'content.update': {
          const [content] = args;
          builder.logger
            .log('[react] Receiving content from builder:', content);
          dispatch({ content });
          opts.onChange?.({ value: content });
          break;
        }
      }
    });

    return () => {
      builder.logger.log('[react] Destroying builder instance');
      unsubscribe();
    };
  }, []);

  return {
    builder,
    content: state.content,
  };
};

export const useBuilder = () => useContext(BuilderContext);

export const useLogger = rootBuilder => {
  const { builder } = useBuilder();

  return builder.logger || rootBuilder?.builder?.logger;
};
