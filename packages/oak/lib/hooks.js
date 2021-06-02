import { useContext } from 'react';

import { AppContext, ElementContext } from './contexts';

export const useOptions = () => {
  return useContext(AppContext).options || {};
};

export const useBuilder = () => {
  const {
    components = [],
    content = [],
    _settingsHolderRef,
    addElement,
    removeElement,
    setElement,
    moveElement,
    contains,
    findNearestParent,
    getComponent,
    getField,
    undo,
    redo,
    _setSettingsHolderRef,
  } = useContext(AppContext);

  return {
    components,
    content,
    _settingsHolderRef,
    addElement,
    removeElement,
    setElement,
    moveElement,
    contains,
    findNearestParent,
    getComponent,
    getField,
    undo,
    redo,
    _setSettingsHolderRef,
  };
};

export const useElement = () => {
  return useContext(ElementContext);
};
