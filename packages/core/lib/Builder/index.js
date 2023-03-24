import { v4 as uuid } from 'uuid';

import { BuilderOptions } from '../types';
import Components from '../Components';
import Emitter from '../Emitter';
import Fields from '../Fields';
import Overrides from '../Overrides';
import Store from '../Store';
import Texts from '../Texts';
import Logger from '../Logger';

export default class Builder extends Emitter {
  #components = null;
  #fields = null;
  #overrides = null;
  #texts = null;
  #store = null;

  constructor ({ addons, content, options = {} }) {
    super();

    this.options = new BuilderOptions(options);
    this.logger = new Logger({ builder: this });

    this.#components = new Components({ builder: this });
    this.#fields = new Fields({ builder: this });
    this.#overrides = new Overrides({ builder: this });
    this.#store = new Store({ builder: this });
    this.#texts = new Texts({ builder: this });

    addons?.forEach(addon => {
      this.logger.log('Initializing builder with addon:', addon);

      addon.fields?.forEach(field => {
        this.#fields.add(field);
      });

      addon.components?.forEach(component => {
        this.#components.add(component);
      });
    });

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

      addon.fields?.forEach(field => {
        this.#fields.add(field);
      });

      addon.components?.forEach(component => {
        this.#components.add(component);
      });
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
    return this.#components.getDisplayableSettings(component.settings);
  }

  getField (type) {
    return this.#fields.get(type);
  }

  getOverride (type, target) {
    return this.#overrides.get(type, target);
  }

  mergeOverrides (overrides) {
    return this.#overrides.merge(overrides);
  }

  getContent () {
    return this.#store.get();
  }

  setContent (content) {
    this.#store.set(content);
  }

  createElement (type, options) {
    return this.#store.createElement(type, options);
  }

  addElement (element, options) {
    this.#store.addElement(element, options);
  }

  removeElement (element, options) {
    this.#store.removeElement(element, options);
  }

  setElement (element, newContent) {
    this.#store.setElement(element, newContent);
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
    return uuid();
  }

  getText (key, def) {
    return this.#texts.get(key, def);
  }
}
