import { Component, ComponentObject, ComponentSettingsFieldObject, ComponentSettingsTabObject, ComponentsGroup, ComponentsGroupObject, FieldObject } from '../types';
import Emitter from '../Emitter';
import Builder from '../Builder';

declare abstract class IComponents {
  static TYPE_COMPONENT: string;
  static TYPE_GROUP: string;
  static COMPONENTS_GROUP_CORE: string;
  static COMPONENTS_GROUP_OTHER: string;

  constructor(options?: { builder: Builder });

  hasGroup(id: string): boolean;
  getGroup(id: string): ComponentsGroup;

  hasComponent(id: string, opts?: { groupId?: string }): boolean;
  getComponent(id: string, opts?: { groupId?: string }): Component;

  append(component: object): void;
  prepend(component: object): void;
  add(component: object, opts?: { mode?: string }): void;
  remove(id: string): void;
  getAll(): object;
  toJSON(): object;
}

export default class Components extends Emitter implements IComponents {
  static TYPE_COMPONENT = 'component';
  static TYPE_GROUP = 'group';

  static COMPONENTS_GROUP_CORE = 'core';
  static COMPONENTS_GROUP_OTHER = 'other';

  #builder = null;
  #groups = null;
  #defaultGroup = null; // Other tab

  constructor ({ builder }: { builder?: Builder} = {}) {
    super();

    this.#builder = builder;
    this.#groups = [];
    this.#defaultGroup = new ComponentsGroup({
      type: 'group',
      id: Components.COMPONENTS_GROUP_OTHER,
      name: t => t('core.components.other.title', 'Other'),
      components: [],
    });
  }

  hasGroup (id: string) { //TODO id is a string?
    return this.#groups.some(ComponentsGroup.FIND_PREDICATE(id));
  }

  getGroup (id: string) { //TODO id is a string?
    return this.#groups.find(ComponentsGroup.FIND_PREDICATE(id));
  }

  hasComponent (
    id: string, { groupId }: { groupId?: string } = {}
  ) { //TODO groupId is a string ? id ? @ka
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

  getComponent (
    id: string,
    { groupId }: { groupId?: string } = {}
  ) { //TODO groupId is a string ? id ?
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

  append (component: ComponentObject) {
    return this.add(component, { mode: 'append' });
  }

  prepend (component: ComponentObject) {
    return this.add(component, { mode: 'prepend' });
  }

  add (
    component: Component | ComponentsGroup | ComponentObject | ComponentsGroupObject,
    { mode = 'append' }: { mode?: string } = {}//TODO mode is a string ?
  ) {
    const mutateMethod = mode === 'append' ? 'push' : 'unshift';

    // This component is a group, add a new group
    if (component.type === Components.TYPE_GROUP) {
      if (!this.hasGroup(component.id)) {
        component = new ComponentsGroup(component);
        (component as ComponentsGroupObject).components =
          (component as ComponentsGroupObject).components || [];

        this.#groups[mutateMethod](component);
        this.emit('groups.add', component);
      }

      return;
    }

    component = new Component(component);

    const group = component.group && this.hasGroup(component.group)
      ? this.getGroup(component.group)
      : this.#defaultGroup;

    const existing = this.getComponent(component.id, { groupId: group.id });

    if (existing) {
      this.#builder.logger.log(
        'Component already exists, updating definition.',
        'Old:', existing,
        'New:', component
      );

      const index = group.components.indexOf(existing);
      group.components[index] = component;
      this.emit('components.update', component, group);
    } else {
      group.components[mutateMethod](component);
      this.emit('components.add', component, group);
    }
  }

  remove (id: string) { // TODO ID is a string ?
    const groupIndex = this.#groups
      .findIndex(ComponentsGroup.FIND_PREDICATE(id));

    if (groupIndex !== -1) {
      this.#builder.logger.log('Removing group:', this.#groups[groupIndex]);
      const group = this.#groups[groupIndex];
      this.#groups.splice(groupIndex, 1);
      this.emit('groups.remove', group);

      return;
    }

    for (const group of this.#groups) {
      const index = group.components
        .findIndex(Component.FIND_PREDICATE(id));

      if (index !== -1) {
        this.#builder.logger
          .log('Removing component:', group.components[index]);
        const component = group.components[index];
        group.components.splice(index, 1);
        this.emit('components.remove', component, group);

        return;
      }
    }

    const index = this.#defaultGroup.components
      .findIndex(Component.FIND_PREDICATE(id));

    if (index !== -1) {
      this.#builder.logger.log(
        'Removing component:', this.#defaultGroup.components[index]
      );
      const component = this.#defaultGroup.components[index];
      this.#defaultGroup.components.splice(index, 1);
      this.emit('components.remove', component, this.#defaultGroup);
    }
  }

  getAll () {
    return {
      groups: this.#groups,
      defaultGroup: this.#defaultGroup,
    };
  }

  getDisplayableSettings (
    element,
    {
      fields,
      component,
    }: {
      fields?: Array<ComponentSettingsFieldObject | ComponentSettingsTabObject>
      component?: ComponentObject
    } = {}) {
    const displayable = [];

    if (!fields) {
      component = component || this.getComponent(element.type);

      if (!component?.settings || !component?.settings.fields) {
        return displayable;
      }

      fields = component?.settings.fields as any; //TODO fix it;
    }

    for (const setting of fields) {
      if (Array.isArray(setting.fields)) {
        displayable.push(...this.getDisplayableSettings(element, {
          fields: setting.fields as any, //TODO fix it;
        }));
      }

      const settingFieldObject = setting as ComponentSettingsFieldObject;

      if (
        settingFieldObject.displayable === true
      ) {
        displayable.push(setting);
      } else if (typeof settingFieldObject.displayable === 'function') {
        if (
          settingFieldObject.displayable(
            element,
            { component, builder: this.#builder }
          )
        ) {
          displayable.push(setting);
        }
      }
    }

    return displayable;
  }

  toJSON () {
    return this.getAll();
  }
}
