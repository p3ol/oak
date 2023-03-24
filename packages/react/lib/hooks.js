import { useContext, useEffect, useMemo, useReducer } from 'react';
import { Builder } from '@oakjs/core';
import { mockState, useEffectAfterMount } from '@junipero/react';

import { BuilderContext } from './contexts';

export const useRootBuilder = opts => {
  const builder = useMemo(() => (
    new Builder({
      ...opts,
      content: opts?.defaultContent || opts?.content,
    })
  ), []);
  const [state, dispatch] = useReducer(mockState, {
    content: builder.getContent(),
    activeTextSheet: opts?.activeTextSheet,
  });

  useEffectAfterMount(() => {
    builder.logger
      .log('[react] Value prop changed:', opts?.content);
    builder.setContent(opts?.content, { emit: false });
    dispatch({ content: builder.getContent() });
  }, [opts?.content]);

  useEffect(() => {
    const unsubscribe = builder.subscribe((eventName, ...args) => {
      switch (eventName) {
        case 'content.update': {
          const [content] = args;
          builder.logger
            .log('[react] Receiving content from builder:', content);
          dispatch({ content });
          opts.onChange?.(content);
          break;
        }
        // Triggers a rerender when the active text sheet changes
        case 'sheets.setActive': {
          const [activeTextSheet] = args;
          dispatch({ activeTextSheet });
          break;
        }
      }
    });

    return () => {
      builder.logger.log('[react] Destroying builder instance');
      unsubscribe();
    };
  }, [builder]);

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
