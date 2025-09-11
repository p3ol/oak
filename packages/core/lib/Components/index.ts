import type {
  ComponentObject,
  ComponentSettingsFieldObject,
  ComponentSettingsTabObject,
  ComponentsGroupObject,
  ElementObject,
  GetTextCallback,
} from '../types';
import {
  Component,
  ComponentOverride,
  ComponentSettingsField,
  ComponentSettingsTab,
  ComponentsGroup,
} from '../classes';
import Emitter from '../Emitter';
import Builder from '../Builder';

export declare abstract class IComponents {
  static TYPE_COMPONENT: string;
  static TYPE_GROUP: string;
  static COMPONENTS_GROUP_CORE: string;
  static COMPONENTS_GROUP_OTHER: string;

  constructor (options?: { builder: Builder });

  hasGroup (id: string): boolean;
  getGroup (id: string): ComponentsGroup;

  hasComponent (id: string, opts?: { groupId?: string }): boolean;
  getComponent (id: string, opts?: { groupId?: string }): Component;

  add (component: object, opts?: { mode?: string }): void;
  remove (id: string): void;
  getAll (): object;
  toJSON (): object;
}

export default class Components extends Emitter implements IComponents {
  static TYPE_COMPONENT = 'component';
  static TYPE_GROUP = 'group';

  static COMPONENTS_GROUP_CORE = 'core';
  static COMPONENTS_GROUP_OTHER = 'other';

  #builder: Builder = null;
  #groups: ComponentsGroup[] = null;
  #defaultGroup: ComponentsGroup = null; // Other tab

  constructor ({ builder }: { builder?: Builder} = {}) {
    super();

    this.#builder = builder;
    this.#groups = [];
    this.#defaultGroup = new ComponentsGroup({
      type: 'group',
      id: Components.COMPONENTS_GROUP_OTHER,
      name: (t: GetTextCallback) => t('core.components.other.title', 'Other'),
      components: [],
    });
  }

  hasGroup (id: string) {
    return this.#groups.some(ComponentsGroup.FIND_PREDICATE(id));
  }

  getGroup (id: string) {
    return this.#groups.find(ComponentsGroup.FIND_PREDICATE(id));
  }

  toObject (): ComponentsGroupObject[] {
    return [
      ...this.#groups.map(group => group.toObject()),
      this.#defaultGroup.toObject(),
    ];

  }

  hasComponent (
    id: string,
    { groupId }: { groupId?: string } = {}
  ) {
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
  ): Component {
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

  add (
    component: ComponentObject | ComponentsGroupObject,
    { mode = 'append' }: { mode?: 'append' | 'prepend' } = {}
  ) {
    const mutateMethod = mode === 'append' ? 'push' : 'unshift';

    // This component is a group, add a new group
    if (component.type === Components.TYPE_GROUP) {
      if (!this.hasGroup(component.id)) {
        const group = new ComponentsGroup(component as ComponentsGroupObject);
        group.components = ((
          component as ComponentsGroupObject
        ).components || []).map(component => new Component(component));

        this.#groups[mutateMethod](group);
        this.emit('groups.add', group);
      }

      return;
    }

    const component_ = new Component(component);
    const group = component_.group && this.hasGroup(component_.group)
      ? this.getGroup(component_.group)
      : this.#defaultGroup;

    const existing = this.getComponent(component.id, { groupId: group.id });

    if (existing) {
      this.#builder.logger.log(
        'Component already exists, updating definition.',
        'Old:', existing,
        'New:', component
      );

      const index = group.components.indexOf(existing);
      group.components[index as any] = component_;
      this.emit('components.update', component, group);
    } else {
      group.components[mutateMethod](component_);
      this.emit('components.add', component, group);
    }
  }

  remove (id: string) {
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
    element: ElementObject,
    { fields, component, override }: {
      fields?: (ComponentSettingsField |
        ComponentSettingsFieldObject |
        ComponentSettingsTab |
        ComponentSettingsTabObject)[];
      component?: Component;
      override?: ComponentOverride;
    } = {}
  ) {
    const displayable: ComponentSettingsField[] = [];

    if (!fields) {
      component = component || this.getComponent(element.type);

      if (!component?.settings?.fields) {
        return displayable;
      }

      fields = component?.settings.fields;
    }

    // Append fields that are only defined inside the component override
    fields = fields.concat(override?.fields?.filter(f => (
      !component?.settings?.fields.find(s =>
        s.type !== 'tab' &&
        (s as ComponentSettingsFieldObject).key === f.key
      )
    )) || []);

    for (const setting of fields) {
      if (Array.isArray(setting.fields)) {
        displayable.push(...this.getDisplayableSettings(element, {
          fields: setting.fields,
        }));
      }

      const settingFieldObject = setting as ComponentSettingsField;

      if (
        settingFieldObject.displayable === true
      ) {
        displayable.push(settingFieldObject);
      } else if (typeof settingFieldObject.displayable === 'function') {
        if (
          settingFieldObject.displayable(
            element,
            { component, builder: this.#builder }
          )
        ) {
          displayable.push(settingFieldObject);
        }
      }
    }

    return displayable;
  }

  toJSON () {
    return this.getAll();
  }
}
