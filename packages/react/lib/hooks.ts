import { useContext, useEffect, useMemo, useReducer } from 'react';
import {
  type AddonObject,
  type ElementObject,
  type BuilderOptions,
  Builder,
} from '@oakjs/core';
import {
  mockState,
  useEffectAfterMount,
} from '@junipero/react';

import type { EditableType } from './types';
import {
  type BuilderContextValue,
  BuilderContext,
  EditableFormContext,
  ElementContext,
} from './contexts';

export interface UseRootBuilderProps {
  activeTextSheet?: string;
  content?: ElementObject[];
  defaultContent?: ElementObject[];
  editableType?: EditableType;
  addons?: AddonObject[];
  options?: Partial<BuilderOptions>;
  onChange?: (content: ElementObject[]) => void;
  onEvent?: (eventName: string, ...args: any[]) => void;
}

export interface RootBuilderState {
  content: ElementObject[];
  activeTextSheet: string | null;
  canUndo: boolean;
  canRedo: boolean;
  addons?: AddonObject[];
  options?: Partial<BuilderOptions>;
  editableType?: EditableType;
}

export const useRootBuilder = ({
  activeTextSheet,
  content,
  defaultContent,
  editableType,
  onChange,
  onEvent,
  ...opts
}: UseRootBuilderProps = {}) => {
  const builder = useMemo(() => (
    new Builder({
      ...opts,
      content: defaultContent || content,
    })
  // We purposely want to create the builder only once, and will update
  // its options & content through effects
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);
  const [state, dispatch] = useReducer(mockState<RootBuilderState>, {
    content: builder.getContent(),
    activeTextSheet: null,
    addons: opts.addons,
    options: opts.options,
    canUndo: false,
    canRedo: false,
    editableType,
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
          break;
        }
        case 'options.update': {
          const [options] = args;
          builder.logger.log(
            '[react] Receiving options from builder:',
            options,
          );
          dispatch({ options });
          break;
        }
      }

      onEvent?.(eventName, ...args);
    });

    return () => {
      builder.logger.log('[react] Destroying builder instance');
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builder]);

  // Allow to change the active text sheet from outside
  useEffect(() => {
    if (activeTextSheet === state.activeTextSheet) {
      return;
    }

    builder.setActiveTextSheet(activeTextSheet);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTextSheet]);

  useEffect(() => {
    if (opts.addons === state.addons) {
      return;
    }

    builder.setAddons(opts.addons);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.addons]);

  useEffect(() => {
    if (opts.options === state.options) {
      return;
    }

    builder.setOptions(opts.options);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.options]);

  return { builder, ...state };
};

export const useBuilder = () => useContext<BuilderContextValue>(BuilderContext);
export const useEditableForm = () => useContext(EditableFormContext);
export const useElement = () => useContext(ElementContext);
