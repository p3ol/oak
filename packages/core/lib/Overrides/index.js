import { ComponentOverride, FieldOverride } from '../types';
import Emitter from '../Emitter';

export default class Overrides extends Emitter {
  #overrides = [];

  add (override) {
    switch (override.type) {
      case 'component':
        override = new ComponentOverride(override);
        this.#overrides.unshift(override);
        break;
      case 'field':
        override = new FieldOverride(override);
        this.#overrides.unshift(override);
        break;
    }

    this.emit('overrides.add', this, override);
  }

  get (overrideType, target) {
    return this.#overrides.find(override =>
      override.type === overrideType &&
      override.targets.includes(target)
    );
  }

  all () {
    return this.#overrides;
  }
}
