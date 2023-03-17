import Components from './Components';
import Emitter from './Emitter';
import Fields from './Fields';
import Overrides from './Overrides';
import Store from './Store';

export default class Builder extends Emitter {
  #components = new Components();
  #fields = new Fields();
  #overrides = new Overrides();

  #store = null;

  constructor ({ addons }) {
    super();

    this.#store = new Store({ builder: this });

    addons?.forEach(addon => {
      addon.fields?.forEach(field => {
        this.#fields.add(field);
      });

      addon.components?.forEach(component => {
        this.#components.add(component);
      });
    });
  }

  getComponent (type) {
    return this.#components.get(type);
  }

  getOverride (type, target) {
    return this.#overrides.get(type, target);
  }
}
