import React, { forwardRef, useReducer, useImperativeHandle } from 'react';
import { mockState } from '@poool/junipero-utils';

import { AppContext } from '../../contexts';
import { GROUP_CORE, GROUP_OTHER } from '../../components';
import Builder from '../Builder';

import styles from './index.styl';

export default forwardRef(({ options }, ref) => {
  const [state, dispatch] = useReducer(mockState, {
    components: [GROUP_CORE, GROUP_OTHER],
    content: [],
  });

  useImperativeHandle(ref, () => ({
    addGroup,
    removeGroup,
    addComponent,
    removeComponent,
  }));

  const getContext = () => ({
    content: state.content,
    components: state.components,
    options,
    addElement,
    removeElement,
  });

  const getGroup_ = id => {
    let group = id ? state.components.find(g => g.id === id) : null;
    group = group || state.components.find(g => g.id === 'other');
    return group;
  };

  const addGroup = ({ id, name, components = [] } = {}) => {
    state.components.push({ id, name, components, type: 'group' });
    dispatch({ components: state.components });
  };

  const removeGroup = id => {
    dispatch({ components: state.components.filter(g => g.id !== id) });
  };

  const addComponent = (props, { groupId } = {}) => {
    const group = getGroup_(groupId);
    group.components.push(props);
    dispatch({ components: state.components });
  };

  const removeComponent = (id, { groupId } = {}) => {
    const group = getGroup_(groupId);
    group.components = group.components.filter(c => c.id !== id);
    dispatch({ components: state.components });
  };

  const addElement = (elmt, parent = state.content) => {
    parent.push(elmt);
    dispatch({ content: state.content });
  };

  const removeElement = (elmt, parent = state.content) => {
    parent.splice(parent.indexOf(elmt), 1);
    dispatch({ content: state.content });
  };

  return (
    <div className={styles.oak}>
      <AppContext.Provider value={getContext()}>
        <Builder />
      </AppContext.Provider>
    </div>
  );
});
