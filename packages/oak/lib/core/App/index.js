import {
  forwardRef,
  useLayoutEffect,
  useReducer,
  useImperativeHandle,
} from 'react';
import { mockState, cloneDeep } from '@poool/junipero-utils';
import { nanoid } from 'nanoid';

import { AppContext } from '../../contexts';
import { GROUP_CORE, GROUP_OTHER } from '../../components';
import Builder from '../Builder';

export default forwardRef(({ content, ...options }, ref) => {
  const [state, dispatch] = useReducer(mockState, {
    components: [GROUP_CORE, GROUP_OTHER],
    renderers: [...GROUP_CORE.components, ...GROUP_OTHER.components],
    content: [],
  });

  useLayoutEffect(() => {
    if (content) {
      setContent(content);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    addGroup,
    removeGroup,
    addComponent,
    removeComponent,
    addElement,
    setElement,
    removeElement,
    moveElement,
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
    moveElement,
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

  const addElement = (
    elmt,
    { parent = state.content, position = 'after' } = {}
  ) => {
    elmt.id = nanoid();

    switch (position) {
      case 'before':
        parent.unshift(elmt);
        break;
      default:
        parent.push(elmt);
    }

    dispatch({ content: state.content });
  };

  const removeElement = (elmt, { parent = state.content } = {}) => {
    if (!elmt.id) {
      return;
    }

    parent.splice(parent.findIndex(e => e.id === elmt.id), 1);
    dispatch({ content: state.content });
  };

  const setElement = (elmt, props) => {
    Object.assign(elmt, props);
    dispatch({ content: state.content });
  };

  const findNearestParent = (elmt, parent) => {
    for (const e of parent) {
      if (e.id === elmt.id) {
        return parent;
      } else if (Array.isArray(e.cols)) {
        return findNearestParent(elmt, e.cols);
      } else if (Array.isArray(e.content)) {
        return findNearestParent(elmt, e.content);
      }
    }

    return null;
  };

  const moveElement = (
    elmt,
    target,
    { parent = state.content, position = 'after' } = {}
  ) => {
    if (!elmt.id) {
      return;
    }

    const nearestParent = findNearestParent(elmt, state.content);
    nearestParent?.splice(nearestParent?.findIndex(e => e.id === elmt.id), 1);

    const newIndex = parent.indexOf(target);
    parent.splice(position === 'after' ? newIndex + 1 : newIndex, 0, elmt);
    dispatch({ content: state.content });
  };

  const ensureElementId = elmt => {
    if (Array.isArray(elmt.cols)) {
      elmt.cols.forEach(c => ensureElementId(c));
    } else if (Array.isArray(elmt.content)) {
      elmt.content.forEach(e => ensureElementId(e));
    }

    if (!elmt.id) {
      elmt.id = nanoid();
    }
  };

  const setContent = content_ => {
    content_ = cloneDeep(content_);
    content_.forEach(e => ensureElementId(e));
    dispatch({ content: content_ });
  };

  return (
    <div className="oak">
      <AppContext.Provider value={getContext()}>
        <Builder />
      </AppContext.Provider>
    </div>
  );
});
