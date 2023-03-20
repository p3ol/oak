import { useContext, useEffect, useReducer, useRef } from 'react';
import { Builder } from '@oakjs/core';
import { mockState } from '@junipero/react';

import { BuilderContext } from './contexts';

export const useRootBuilder = ({ addons }) => {
  const builderRef = useRef(new Builder({ addons }));
  const [state, dispatch] = useReducer(mockState, {
    content: builderRef.current.getContent(),
  });

  useEffect(() => {
    const unsubscribe = builderRef.current.subscribe(content => {
      dispatch({ content });
    });

    return () => {
      unsubscribe();
    };
  });

  return {
    builder: builderRef.current,
    content: state.content,
  };
};

export const useBuilder = () => useContext(BuilderContext);
