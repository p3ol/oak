import { omit } from '@junipero/core';

import { ComponentOverride, FieldOverride, SettingOverride } from '../types';
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
      case 'setting':
        override = new SettingOverride(override);
        this.#overrides.unshift(override);
        break;
    }

    this.emit('overrides.add', this, override);

    return override;
  }

  get (overrideType, target, { output, setting } = {}) {
    const strategy = this.#builder?.options?.overrideStrategy;
    const overrides = this.#overrides.filter(override =>
      override.type === overrideType &&
      (override.targets.includes('*') || override.targets.includes(target))
    );

    switch (overrideType) {
      case 'component': {
        const override = strategy === 'merge'
          ? this.merge(overrides) : overrides[0];

        switch (output) {
          case 'field': {
            const newComponentField = override?.fields
              .find(f => f.key === setting?.key);

            return Object.assign(
              {},
              this.#builder.getOverride('field',
                newComponentField?.type || setting?.type),
              omit(newComponentField || {}, ['type', 'key'])
            );
          }
          default:
            return override;
        }
      }
      case 'setting':
        return overrides.find(o => o.key === setting?.key);
      default:
        return strategy === 'merge' ? this.merge(overrides) : overrides[0];
    }
  }

  merge (overrides) {
    return overrides.reduce((res, override) => {
      Object.assign(res, override);

      return res;
    }, {});
  }

  all () {
    return this.#overrides;
  }
}
