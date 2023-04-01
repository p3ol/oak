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
    canUndo: false,
    canRedo: false,
  });

  useEffectAfterMount(() => {
    builder.logger
      .log('[react] Value prop changed:', opts?.content);
    builder.setContent(opts?.content, { emit: false });
    dispatch({ content: builder.getContent() });
  }, [opts?.content]);

  useEffect(() => {
    const unsubscribe = builder.subscribe((eventName, ...args) => {
      builder.logger.log('[react]', 'Event:', eventName, ...args);

      switch (eventName) {
        case 'content.update': {
          const [content] = args;
          builder.logger
            .log('[react] Receiving content from builder:', content, builder.canUndo(), builder.canRedo());
          dispatch({
            content,
            canUndo: builder.canUndo(),
            canRedo: builder.canRedo(),
          });
          opts.onChange?.(content);
          break;
        }
        // Triggers a rerender when the active text sheet changes
        case 'sheets.setActive': {
          const [activeTextSheet] = args;
          dispatch({ activeTextSheet });
          break;
        }
        case 'history.undo':
        case 'history.redo':
        case 'history.commit': {
          console.log('history', ...args);
        }
      }

      opts?.onEvent?.(eventName, ...args);
    });

    return () => {
      builder.logger.log('[react] Destroying builder instance');
      unsubscribe();
    };
  }, [builder]);

  return { builder, ...state };
};

export const useBuilder = () => useContext(BuilderContext);

export const useLogger = rootBuilder => {
  const { builder } = useBuilder();

  return builder.logger || rootBuilder?.builder?.logger;
};
