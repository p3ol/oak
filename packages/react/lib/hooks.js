import { useContext, useEffect, useMemo, useReducer } from 'react';
import { Builder } from '@oakjs/core';
import { mockState, useEffectAfterMount } from '@junipero/react';

import { BuilderContext } from './contexts';

export const useRootBuilder = ({
  activeTextSheet,
  content,
  defaultContent,
  onChange,
  onEvent,
  ...opts
}) => {
  const builder = useMemo(() => (
    new Builder({
      ...opts,
      content: defaultContent || content,
    })
  ), []);
  const [state, dispatch] = useReducer(mockState, {
    content: builder.getContent(),
    activeTextSheet,
    canUndo: false,
    canRedo: false,
  });

  useEffectAfterMount(() => {
    if (content === builder.getContent()) {
      return;
    }

    builder.logger
      .log('[react] Value prop changed:', content);
    builder.setContent(content, { emit: false, commit: false });

    dispatch({
      content: builder.getContent(),
      canUndo: builder.canUndo(),
      canRedo: builder.canRedo(),
    });
  }, [content]);

  useEffect(() => {
    const unsubscribe = builder.subscribe((eventName, ...args) => {
      builder.logger.log('[react]', 'Event:', eventName, ...args);

      switch (eventName) {
        case 'content.update': {
          const [content_] = args;
          builder.logger
            .log('[react] Receiving content from builder:', content_);
          dispatch({
            content: content_,
            canUndo: builder.canUndo(),
            canRedo: builder.canRedo(),
          });
          onChange?.(content_);
          break;
        }
        // Triggers a rerender when the active text sheet changes
        case 'sheets.setActive': {
          const [activeTextSheet] = args;
          dispatch({ activeTextSheet });
          break;
        }
      }

      onEvent?.(eventName, ...args);
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
