import { exists } from '@junipero/core';
import { v4 as uuid } from 'uuid';

import Emitter from '../Emitter';
import {
  AddonObject,
  BuilderObject,
  BuilderOptions,
  Component,
  ComponentObject,
  ComponentOverride,
  ComponentOverrideObject,
  ComponentSettingsFieldObject,
  ComponentSettingsTab,
  ComponentSettingsTabObject,
  ComponentsGroupObject,
  ElementObject,
  ElementSettingsKeyObject,
  Field,
  FieldOverride,
  FieldOverrideObject,
} from '../types';
import Logger from '../Logger';
import Components from '../Components';
import Fields from '../Fields';
import Overrides from '../Overrides';
import Store from '../Store';
import Texts from '../Texts';
import Settings from '../Settings';

export default class Builder extends Emitter {
  logger: Logger = null;
  options: BuilderOptions = null;

  #components: Components = null;
  #fields: Fields = null;
  #overrides: Overrides = null;
  #texts: Texts = null;
  #store: Store = null;
  #settings: Settings = null;
  #addons: Array<AddonObject> = [];

  constructor (
    { addons, content, options = {} }:
    {
      addons?: AddonObject[],
      content?: ElementObject[],
      options?: BuilderObject
    } = {}
  ) {
    super();

    this.options = new BuilderOptions(options);
    this.logger = new Logger({ builder: this });

    this.#components = new Components({ builder: this });
    this.#fields = new Fields({ builder: this });
    this.#overrides = new Overrides({ builder: this });
    this.#store = new Store({ builder: this });
    this.#texts = new Texts({ builder: this });
    this.#settings = new Settings({ builder: this });

    if (Array.isArray(addons)) {
      this.#addons = addons;
      addons.forEach(addon => {
        this.logger.log('Initializing builder with addon:', addon);
        this.addAddon(addon);
      });
    }

    if (content) {
      this.logger.log('Initializing builder with content:', content);
      this.#store.set(content);
    }
  }

  subscribe (callback: Function) {
    const subscriptions = [
      super.subscribe(callback),
      this.#store.subscribe(this.emit.bind(this)),
      this.#texts.subscribe(this.emit.bind(this)),
      this.#components.subscribe(this.emit.bind(this)),
      this.#fields.subscribe(this.emit.bind(this)),
      this.#overrides.subscribe(this.emit.bind(this)),
      this.#settings.subscribe(this.emit.bind(this)),
    ];

    return () => {
      subscriptions.forEach(u => u());
    };
  }

  setAddons (addons: Array<AddonObject>): void {
    this.#addons?.forEach(addon => {
      this.logger.log('Removing builder addon:', addon);
      this.removeAddon(addon);
    });

    this.#addons = addons;
    this.#addons?.forEach(addon => {
      this.logger.log('Updating builder addon:', addon);
      this.addAddon(addon);
    });

    this.emit('addons.update', addons);
  }

  addAddon (addon: AddonObject): void {
    addon.fields?.forEach(field => {
      this.#fields.add(field);
    });

    addon.components?.forEach(component => {
      this.#components.add(component);
    });

    addon.texts?.forEach(sheet => {
      this.#texts.addSheet(sheet);
    });

    addon.overrides?.forEach(override => {
      this.#overrides.add(override);
    });

    addon.settings?.forEach(setting => {
      this.#settings.add(setting);
    });
  }

  removeAddon (addon: AddonObject): void {
    addon.settings?.forEach(setting => {
      this.#settings.remove(setting.id);
    });

    addon.overrides?.forEach(override => {
      this.#overrides.remove(override.id);
    });

    addon.texts?.forEach(sheet => {
      this.#texts.removeSheet(sheet.id);
    });

    addon.components?.forEach(component => {
      this.#components.remove(component.id);
    });

    addon.fields?.forEach(field => {
      this.#fields.remove(field.type);
    });
  }

  getAvailableComponents (): Array<ComponentsGroupObject> {
    const {
      groups,
      defaultGroup,
    } = this.#components.getAll();
    const groups_ = groups.map(group => group.toObject());

    return [...groups_, defaultGroup.toObject()];
  }

  getComponent (type: string): ComponentObject {
    return this.#components.getComponent(type).toObject();
  }

  getComponentDisplayableSettings (
    element: ElementObject,
    { component }: { component: ComponentObject}
  ): Array<ComponentSettingsTabObject | ComponentSettingsFieldObject> {
    const component_ = new Component(component);

    return [
      ...this.#components
        .getDisplayableSettings?.(
          element, { component: component_ }
        ).map(field => field.toObject()) || [],
      ...this.#settings.getDisplayable?.(element).map(
        setting => setting.toObject()
      ) || [],
    ];
  }

  getAvailableFields () {
    return this.#fields.all().map((field: Field) => field.toObject());
  }

  getField (type: string) {
    return this.#fields.get(type).toObject();
  }

  getOverride (
    type: 'component' | 'field' | 'setting',
    target: string,
    opts?: any
  ) {
    return this.#overrides.get(type, target, opts);
  }

  mergeOverrides (
    overrides: Array<ComponentOverrideObject | FieldOverrideObject>
  ) {
    const ovrrides_ = overrides.map(override => {
      if (override.type === 'component') {
        return new ComponentOverride(override);
      } else {
        return new FieldOverride(override);
      }
    });

    return this.#overrides.merge(ovrrides_);
  }

  getContent () {
    return this.#store.get();
  }

  setContent (content: Array<ElementObject>, options: { emit?: boolean }) {
    this.#store.set(content, options);
  }

  createElement (type: string, options?: {
    component?: ComponentObject | Component,
    override?: ComponentOverrideObject,
    baseElement?: ElementObject,
    [_: string]: any
  }) {
    return this.#store.createElement(type, options);
  }

  addElement (element: ElementObject, options?: {
    parent?: Array<ElementObject>,
    position?: 'before' | 'after',
    component?: ComponentObject,
    [_: string]: any
  }) {
    return this.#store.addElement(element, options);
  }

  addElements (elements: Array<ElementObject>, options?:{
    parent?: Array<ElementObject>,
    position?: 'before' | 'after',
    component?: ComponentObject,
    [_: string]: any
  }) {
    return this.#store.addElements(elements, options);
  }

  getElement (id: string, options?: {
    parent?: any[];
    deep?: boolean;
}) {
    return this.#store.getElement(id, options);
  }

  removeElement (id: string, options?: {
    parent?: any[];
    deep?: boolean;
}) {
    return this.#store.removeElement(id, options);
  }

  setElement (id: string, updates: ElementObject, options: {
    element?: ElementObject;
    parent?: ElementObject[];
    deep?: boolean;
}) {
    return this.#store.setElement(id, updates, options);
  }

  moveElement (
    element: ElementObject,
    sibling: ElementObject,
    options?: {
      parent?: Array<ElementObject>,
      position?: 'before' | 'after'
    }
  ) {
    return this.#store.moveElement(element, sibling, options);
  }

  duplicateElement (element: ElementObject, options?: {
    parent?: ElementObject[];
}) {
    return this.#store.duplicateElement(element, options);
  }

  getElementSettings (
    element: ElementObject,
    key: ElementSettingsKeyObject |string,
    def: any
  ) { //TODO FIX IT
    return this.#store.getElementSettings(element, key, def);
  }

  setElementSettings (
    element: ElementObject,
    key: ElementSettingsKeyObject | string,
    value: any
  ) { // TODO FIX IT
    return this.#store.setElementSettings(element, key, value);
  }

  undo () {
    this.#store.undo();
  }

  redo () {
    this.#store.redo();
  }

  canUndo () {
    return this.#store.canUndo();
  }

  canRedo () {
    return this.#store.canRedo();
  }

  resetHistory () {
    this.#store.resetHistory();
  }

  generateId () {
    const customId = this.options.generateId?.();

    return exists(customId) && customId !== '' ? customId : uuid();
  }

  getTextSheet (id: string) {
    return this.#texts.getSheet(id);
  }

  getText (key: string, def: string) {
    return this.#texts.get(key, def);
  }

  setText (key: string, value: string) {
    return this.#texts.set(key, value);
  }

  getActiveTextSheet () {
    return this.#texts.getActiveSheet();
  }

  setActiveTextSheet (id: string) {
    return this.#texts.setActiveSheet(id);
  }

  getAvailableSettings () {
    return this.#settings.all().map(
      (setting: ComponentSettingsTab) => setting.toObject()
    );
  }
}
