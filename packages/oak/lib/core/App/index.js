import {
  forwardRef,
  useEffect,
  useReducer,
  useCallback,
  useImperativeHandle,
} from 'react';
import { mockState, cloneDeep } from '@poool/junipero-utils';
import { nanoid } from 'nanoid';

import { AppContext } from '../../contexts';
import { GROUP_CORE, GROUP_OTHER } from '../../components';
import { FIELD_TEXT, FIELD_SELECT } from '../../fields';
import Builder from '../Builder';

export default forwardRef((options, ref) => {
  const [state, dispatch] = useReducer(mockState, {
    components: [GROUP_CORE, GROUP_OTHER],
    content: [],
    fieldTypes: [FIELD_TEXT, FIELD_SELECT],
    _settingsHolderRef: null,
  });

  useEffect(() => {
    init();
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
    findNearestParent,
    contains,
    getComponent,
    getField,
  }));

  const getContext = useCallback(() => ({
    content: state.content,
    components: state.components,
    _settingsHolderRef: state._settingsHolderRef,
    options,
    addElement,
    removeElement,
    setElement,
    moveElement,
    setContent,
    findNearestParent,
    contains,
    getComponent,
    getField,
    _setSettingsHolderRef,
  }), Object.values(state));

  const init = () => {
    if (options.addons) {
      options.addons.forEach(addon => {
        if (addon.fieldTypes) {
          state.fieldTypes = (state.fieldTypes || [])
            .concat(addon.fieldTypes);
        }

        if (addon.components) {
          addon.components.forEach(c => {
            if (c.group) {
              const group = getGroup_(c.group);

              if (!group.components.find(
                cp => cp.id === (c.component?.id || c.id)
              )) {
                group.components.push(c.component);
              }
            } else if (
              c.type === 'group' &&
              !state.components.find(cp => cp.id === c.id)
            ) {
              state.components.push(c);
            } else {
              const group = getGroup_('other');

              if (!group.components.find(cp => cp.id === c.id)) {
                group.components.push(c);
              }
            }
          });
        }
      });
    }

    if (options.content) {
      const content_ = cloneDeep(options.content);
      content_.forEach(e => normalizeElement(e));
      state.content = content_;
    }

    dispatch(state);
  };

  const onChange = content => {
    dispatch({ content: content || state.content });
    options?.events?.onChange?.({ value: content || state.content });
  };

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
    dispatch({ components: state.components });
  };

  const removeComponent = (id, { groupId } = {}) => {
    const group = getGroup_(groupId);
    group.components = group.components.filter(c => c.id !== id);
    dispatch({ components: state.components });
  };

  const addElement = (
    elmt,
    { parent = state.content, position = 'after' } = {}
  ) => {
    normalizeElement(elmt);

    switch (position) {
      case 'before':
        parent.unshift(elmt);
        break;
      default:
        parent.push(elmt);
    }

    onChange();
  };

  const removeElement = (elmt, { parent = state.content } = {}) => {
    if (!elmt.id) {
      return;
    }

    parent.splice(parent.findIndex(e => e.id === elmt.id), 1);
    onChange();
  };

  const setElement = (elmt, props) => {
    Object.assign(elmt, props);
    onChange();
  };

  const moveElement = (
    elmt,
    target,
    { parent = state.content, position = 'after' } = {}
  ) => {
    if (
      !elmt.id ||
      !target.id ||
      elmt.id === target.id ||
      contains(target, { parent: elmt })
    ) {
      return;
    }

    const nearestParent = findNearestParent(elmt);
    nearestParent?.splice(nearestParent?.findIndex(e => e.id === elmt.id), 1);

    const newIndex = parent.indexOf(target);
    parent.splice(position === 'after' ? newIndex + 1 : newIndex, 0, elmt);
    onChange();
  };

  const findNearestParent = (elmt, { parent = state.content } = {}) => {
    for (const e of parent) {
      if (e.id === elmt.id) {
        return parent;
      } else if (Array.isArray(e.cols)) {
        const nearest = findNearestParent(elmt, { parent: e.cols });
        if (nearest) return nearest;
      } else if (Array.isArray(e.content)) {
        const nearest = findNearestParent(elmt, { parent: e.content });
        if (nearest) return nearest;
      }
    }

    return null;
  };

  const contains = (elmt, { parent = state.content } = {}) =>
    elmt.id === parent.id ||
    (
      Array.isArray(parent) &&
      parent.some(e => contains(elmt, { parent: e }))
    ) ||
    (
      Array.isArray(parent.cols) &&
      contains(elmt, { parent: parent.cols })
    ) ||
    (
      Array.isArray(parent.content) &&
      contains(elmt, { parent: parent.content })
    );

  const normalizeElement = elmt => {
    if (Array.isArray(elmt.cols)) {
      elmt.cols.forEach(c => normalizeElement(c));
    } else if (Array.isArray(elmt.content)) {
      elmt.content.forEach(e => normalizeElement(e));
    }

    if (!elmt.id) {
      elmt.id = nanoid();
    }

    const component = getComponent(elmt.type);

    if (component?.deserialize) {
      Object.assign(elmt, component.deserialize(elmt));
    }
  };

  const setContent = content_ => {
    content_ = cloneDeep(content_);
    content_.forEach(e => normalizeElement(e));
    onChange(content_);
  };

  const getComponent = (type, { parent = state.components } = {}) =>
    parent.reduce((val, c) => val || (
      c.type === 'group'
        ? getComponent(type, { parent: c.components })
        : c.id === type ? c : val
    ), null);

  const getField = type =>
    state.fieldTypes.find(f => f.type === type);

  const _setSettingsHolderRef = ref => {
    if (ref === state._settingsHolderRef) {
      return;
    }

    dispatch({ _settingsHolderRef: ref });
  };

  return (
    <div className="oak">
      <AppContext.Provider value={getContext()}>
        <Builder />
      </AppContext.Provider>
    </div>
  );
});
