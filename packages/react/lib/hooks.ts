import { useContext, useEffect, useMemo, useReducer } from 'react';
import {
  type AddonObject,
  type ElementObject,
  Builder,
} from '@oakjs/core';
import { MockState, mockState, useEffectAfterMount } from '@junipero/react';

import { BuilderContext } from './contexts';

export interface RootBuilderState {
  content: ElementObject[];
  activeTextSheet: string | null;
  addons: AddonObject[];
  canUndo: boolean;
  canRedo: boolean;
}

export const useRootBuilder = ({
  activeTextSheet,
  content,
  defaultContent,
  onChange,
  onEvent,
  ...opts
}: {
  activeTextSheet?: string;
  content?: Array<ElementObject>;
  defaultContent?: Array<ElementObject>;
  onChange?: (content: Array<ElementObject>) => void;
  onEvent?: (eventName: string, ...args: any[]) => void;
  addons?: AddonObject[],
} = {}) => {
  const builder = useMemo(() => (
    new Builder({
      ...opts,
      content: defaultContent || content,
    })
  ), []);
  const [state, dispatch] = useReducer<MockState<RootBuilderState>>(mockState, {
    content: builder.getContent(),
    activeTextSheet: null,
    addons: opts.addons,
    canUndo: false,
    canRedo: false,
  });

  // Allow to change the content from outside
  useEffectAfterMount(() => {
    if (content === builder.getContent()) {
      return;
    }

    builder.logger
      .log('[react] Value prop changed:', content);
    builder.setContent(content, { emit: false });

    dispatch({
      content: builder.getContent(),
      canUndo: builder.canUndo(),
      canRedo: builder.canRedo(),
    });
  }, [content]);

  useEffect(() => {
    const unsubscribe = builder.subscribe((
      eventName: string,
      ...args: any[]
    ) => {
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
          builder.logger.log(
            '[react] Receiving active texts sheet from builder:',
            activeTextSheet
          );
          dispatch({ activeTextSheet });
          break;
        }
        case 'history.reset': {
          dispatch({
            canUndo: builder.canUndo(),
            canRedo: builder.canRedo(),
          });
          break;
        }
        case 'addons.update': {
          const [addons] = args;
          builder.logger.log(
            '[react] Receiving addons from builder:',
            addons,
          );
          dispatch({ addons });
        }
      }

      onEvent?.(eventName, ...args);
    });

    return () => {
      builder.logger.log('[react] Destroying builder instance');
      unsubscribe();
    };
  }, [builder]);

  // Allow to change the active text sheet from outside
  useEffect(() => {
    if (activeTextSheet === state.activeTextSheet) {
      return;
    }

    builder.setActiveTextSheet(activeTextSheet);
  }, [activeTextSheet]);

  useEffect(() => {
    if (opts.addons === state.addons) {
      return;
    }

    builder.setAddons(opts.addons);
  }, [opts.addons]);

  return { builder, ...state };
};

export const useBuilder = () => useContext(BuilderContext);
