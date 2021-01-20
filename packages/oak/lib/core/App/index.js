import React, { forwardRef, useReducer, useImperativeHandle } from 'react';
import { mockState } from '@poool/junipero-utils';

import { AppContext } from '../../contexts';
import { GROUP_CORE, GROUP_OTHER } from '../../components';
import Builder from '../Builder';

import styles from './index.styl';

export default forwardRef(({ content, ...options }, ref) => {
  const [state, dispatch] = useReducer(mockState, {
    components: [GROUP_CORE, GROUP_OTHER],
    renderers: [...GROUP_CORE.components, ...GROUP_OTHER.components],
    content: content || [],
  });

  useImperativeHandle(ref, () => ({
    addGroup,
    removeGroup,
    addComponent,
    removeComponent,
    addElement,
    setElement,
    removeElement,
    setContent,
  }));

  const getContext = () => ({
    content: state.content,
    components: state.components,
    renderers: state.renderers,
    options,
    addElement,
    removeElement,
    setElement,
    setContent,
  });

  const getGroup_ = id => {
    let group = id ? state.components.find(g => g.id === id) : null;
    group = group || state.components.find(g => g.id === 'other');

    return group;
  };

  const addGroup = ({ id, name, components = [] } = {}) => {
    state.components.splice(
      state.components.length - 2, 0, { id, name, components, type: 'group' }
    );
    dispatch({ components: state.components });
  };

  const removeGroup = id => {
    dispatch({ components: state.components.filter(g => g.id !== id) });
  };

  const addComponent = (props, { groupId } = {}) => {
    const group = getGroup_(groupId);
    group.components.push(props);
    state.renderers.push(props);
    dispatch({ components: state.components, renderers: state.renderers });
  };

  const removeComponent = (id, { groupId } = {}) => {
    const group = getGroup_(groupId);
    group.components = group.components.filter(c => c.id !== id);
    state.renderers = state.renderers.filter(r => r.id !== id);
    dispatch({ components: state.components, renderers: state.renderers });
  };

  const addElement = (elmt, parent = state.content, isFirst) => {
    if (isFirst) {
      parent.unshift(elmt);
    } else {
      parent.push(elmt);
    }

    dispatch({ content: state.content });
  };

  const removeElement = (elmt, parent = state.content) => {
    parent.splice(parent.indexOf(elmt), 1);
    dispatch({ content: state.content });
  };

  const setElement = (elmt, props) => {
    Object.assign(elmt, props);
    dispatch({ content: state.content });
  };

  const setContent = content => dispatch({ content });

  return (
    <div className={styles.oak}>
      <AppContext.Provider value={getContext()}>
        <Builder />
      </AppContext.Provider>
    </div>
  );
});
