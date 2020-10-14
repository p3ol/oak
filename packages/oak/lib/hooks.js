import { useContext } from 'react';

import { AppContext } from './contexts';

export const useOptions = () => {
  return useContext(AppContext).options || {};
};

export const useBuilder = () => {
  const {
    components = [],
    renderers = [],
    content = [],
    addElement,
    removeElement,
    setElement,
  } = useContext(AppContext);
  return {
    components,
    renderers,
    content,
    addElement,
    removeElement,
    setElement,
  };
};
