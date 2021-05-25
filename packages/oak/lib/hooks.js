import { useContext } from 'react';

import { AppContext } from './contexts';

export const useOptions = () => {
  return useContext(AppContext).options || {};
};

export const useBuilder = () => {
  const {
    components = [],
    content = [],
    addElement,
    removeElement,
    setElement,
    moveElement,
    contains,
    findNearestParent,
    getComponent,
    getField,
  } = useContext(AppContext);

  return {
    components,
    content,
    addElement,
    removeElement,
    setElement,
    moveElement,
    contains,
    findNearestParent,
    getComponent,
    getField,
  };
};
