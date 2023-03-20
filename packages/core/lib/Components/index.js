import { Component, ComponentGroup } from '../types';
import Emitter from '../Emitter';

export default class Components extends Emitter {
  static TYPE_COMPONENT = 'component';
  static TYPE_GROUP = 'group';

  static COMPONENTS_GROUP_CORE = 'core';
  static COMPONENTS_GROUP_OTHER = 'other';

  #builder = null;
  #groups = null;
  #defaultGroup = null; // Other tab

  constructor ({ builder } = {}) {
    super();

    this.#builder = builder;
    this.#groups = [];
    this.#defaultGroup = new ComponentGroup({
      type: 'group',
      id: Components.COMPONENTS_GROUP_OTHER,
      components: [],
    });
  }

  hasGroup (id) {
    return this.#groups.some(ComponentGroup.FIND_PREDICATE(id));
  }

  getGroup (id) {
    return this.#groups.find(ComponentGroup.FIND_PREDICATE(id));
  }

  hasComponent (id, { groupId } = {}) {
    if (groupId) {
      return this.getGroup(groupId)?.components
        .some(Component.FIND_PREDICATE.bind(null, id));
    }

    for (const group of this.#groups) {
      if (group.components.some(Component.FIND_PREDICATE(id))) {
        return true;
      }
    }

    return this.#defaultGroup.components
      .some(Component.FIND_PREDICATE.bind(null, id));
  }

  getComponent (id, { groupId } = {}) {
    if (groupId) {
      return this.getGroup(groupId)?.components
        ?.find(Component.FIND_PREDICATE(id));
    }

    for (const group of this.#groups) {
      const component = group.components.find(Component.FIND_PREDICATE(id));

      if (component) {
        return component;
      }
    }

    return this.#defaultGroup.components.find(Component.FIND_PREDICATE(id));
  }

  append (component) {
    return this.add(component, { mode: 'append' });
  }

  prepend (component) {
    return this.add(component, { mode: 'prepend' });
  }

  add (component, { mode = 'append' } = {}) {
    const mutateMethod = mode === 'append' ? 'push' : 'unshift';

    // This component is a group, add a new group
    if (
      component.type === Components.TYPE_GROUP &&
      !this.hasGroup(component.id)
    ) {
      component = new ComponentGroup(component, { builder: this.#builder });
      component.components = component.components || [];

      this.#groups[mutateMethod](component);
      this.emit('groups.add', component);

      return;
    }

    component = new Component(component, { builder: this.#builder });

    // If component has a group provided, we try to add it to the group
    if (
      component.group &&
      this.hasGroup(component.group) &&
      !this.hasComponent(component.id, { groupId: component.group })
    ) {
      const group = this.getGroup(component.group);
      group.components[mutateMethod](component);
      this.emit('components.add', component, group);

      return;
    }

    // Else we add the component to the default group
    if (
      !this.hasComponent(component.id, {
        groupId: Components.COMPONENTS_GROUP_OTHER,
      })
    ) {
      this.#defaultGroup.components[mutateMethod](component);
      this.emit('components.add', component, this.#defaultGroup);
    }
  }

  remove (id) {
    const groupIndex = this.#groups
      .findIndex(ComponentGroup.FIND_PREDICATE.bind(null, id));

    if (groupIndex !== -1) {
      const group = this.#groups[groupIndex];
      this.#groups.splice(groupIndex, 1);
      this.emit('groups.remove', group);

      return;
    }

    for (const group of this.#groups) {
      const index = group.components
        .findIndex(Component.FIND_PREDICATE.bind(null, id));

      if (index !== -1) {
        const component = group.components[index];
        group.components.splice(index, 1);
        this.emit('components.remove', component, group);

        return;
      }
    }

    const index = this.#defaultGroup.components
      .findIndex(Component.FIND_PREDICATE.bind(null, id));

    if (index !== -1) {
      const component = this.#defaultGroup.components[index];
      this.#defaultGroup.components.splice(index, 1);
      this.emit('components.remove', component, this.#defaultGroup);
    }
  }

  all () {
    return {
      groups: this.#groups,
      defaultGroup: this.#defaultGroup,
    };
  }

  toJSON () {
    return this.all();
  }
}
