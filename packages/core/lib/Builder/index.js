import { exists } from '@junipero/core';
import { v4 as uuid } from 'uuid';

import { BuilderOptions } from '../types';
import Components from '../Components';
import Emitter from '../Emitter';
import Fields from '../Fields';
import Overrides from '../Overrides';
import Store from '../Store';
import Texts from '../Texts';
import Logger from '../Logger';
import { Settings } from '../Settings';

export default class Builder extends Emitter {
  #components = null;
  #fields = null;
  #overrides = null;
  #texts = null;
  #store = null;
  #settings = null;

  constructor ({ addons, content, options = {} } = {}) {
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

  subscribe (callback) {
    const subscriptions = [
      super.subscribe(callback),
      this.#store.subscribe(this.emit.bind(this)),
      this.#components.subscribe(this.emit.bind(this)),
      this.#fields.subscribe(this.emit.bind(this)),
      this.#overrides.subscribe(this.emit.bind(this)),
    ];

    return () => {
      subscriptions.forEach(u => u());
    };
  }

  setAddons (addons) {
    addons?.forEach(addon => {
      this.logger.log('Updating builder addon:', addon);
      this.addAddon(addon);
    });
  }

  addAddon (addon) {
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

  getAvailableComponents () {
    const { groups, defaultGroup } = this.#components.all();

    return [...groups, defaultGroup];
  }

  getComponent (type) {
    return this.#components.getComponent(type);
  }

  getComponentDisplayableSettings (component) {
    if (!component) {
      return [];
    }

    return this.#components.getDisplayableSettings(component.settings);
  }

  getAvailableFields () {
    return this.#fields.all();
  }

  getField (type) {
    return this.#fields.get(type);
  }

  getOverride (type, target, opts) {
    return this.#overrides.get(type, target, opts);
  }

  mergeOverrides (overrides) {
    return this.#overrides.merge(overrides);
  }

  getContent () {
    return this.#store.get();
  }

  setContent (content, options) {
    this.#store.set(content, options);
  }

  createElement (type, options) {
    return this.#store.createElement(type, options);
  }

  addElement (element, options) {
    this.#store.addElement(element, options);
  }

  getElement (id, options) {
    return this.#store.getElement(id, options);
  }

  removeElement (id, options) {
    this.#store.removeElement(id, options);
  }

  setElement (id, updates, options) {
    this.#store.setElement(id, updates, options);
  }

  moveElement (element, sibling, options) {
    this.#store.moveElement(element, sibling, options);
  }

  duplicateElement (element, options) {
    this.#store.duplicateElement(element, options);
  }

  getElementSettings (element, key, def) {
    return this.#store.getElementSettings(element, key, def);
  }

  setElementSettings (element, key, value) {
    this.#store.setElementSettings(element, key, value);
  }

  generateId () {
    const customId = this.options.generateId?.();

    return exists(customId) && customId !== '' ? customId : uuid();
  }

  getTextSheet (id) {
    return this.#texts.getSheet(id);
  }

  getText (key, def) {
    return this.#texts.get(key, def);
  }

  setText (key, value) {
    this.#texts.set(key, value);
  }

  getActiveTextSheet () {
    return this.#texts.getActiveSheet();
  }

  setActiveTextSheet (id) {
    this.#texts.setActiveSheet(id);
  }

  getAvailableSettings () {
    return this.#settings.all();
  }
}
