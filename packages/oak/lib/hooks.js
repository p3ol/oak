import { useContext } from 'react';

import { AppContext, ElementContext } from './contexts';

export const useOptions = () => {
  return useContext(AppContext).options || {};
};

export const useBuilder = () => {
  const {
    components = [],
    content = [],
    ...rest
  } = useContext(AppContext);

  return {
    components,
    content,
    ...rest,
  };
};

export const useElement = () => {
  return useContext(ElementContext);
};
