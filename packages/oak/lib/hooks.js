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
    isUndoPossible,
    isRedoPossible,
    _setSettingsHolderRef,
    getText,
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
    isUndoPossible,
    isRedoPossible,
    _setSettingsHolderRef,
    getText,
  };
};

export const useElement = () => {
  return useContext(ElementContext);
};
