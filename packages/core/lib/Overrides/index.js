import { ComponentOverride, FieldOverride } from '../types';
import Emitter from '../Emitter';

export default class Overrides extends Emitter {
  #overrides = [];

  #builder = null;

  constructor ({ builder } = {}) {
    super();

    this.#builder = builder;
  }

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

  get (overrideType, target, { output, field } = {}) {
    const override = this.#overrides.find(override =>
      override.type === overrideType &&
      override.targets.includes(target)
    );

    switch (overrideType) {
      case 'component':
        switch (output) {
          case 'field': {
            const field_ = override?.fields
              .find(f => f.key === field?.key);

            return Object.assign({},
              this.#builder.getField(field_?.type || field?.type),
              this.#builder.getOverride('field', field_?.type || field?.type));
          }
          default:
            return override;
        }
    }
  }

  all () {
    return this.#overrides;
  }
}
