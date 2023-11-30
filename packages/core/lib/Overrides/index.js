import { omit } from '@junipero/core';
import { mergeDeep } from '@junipero/react';

import { ComponentOverride, FieldOverride, SettingOverride } from '../types';
import Emitter from '../Emitter';

export default class Overrides extends Emitter {
  static FIND_PREDICATE = id => o => id ? o.id === id : null;

  #overrides = [];
  #builder = null;

  constructor ({ builder } = {}) {
    super();

    this.#builder = builder;
  }

  add (override) {
    const existing = this.#overrides
      .find(Overrides.FIND_PREDICATE(override.id));

    if (existing) {
      this.#builder?.logger.log(
        'Override already exists, updating definition.',
        'Old:', existing,
        'New:', override
      );

      this.#overrides.splice(this.#overrides.indexOf(existing), 1, override);
      this.emit('overrides.update', override);

      return override;
    }

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
              ?.find(f => f.key === setting?.key);

            return Object.assign(
              { type: newComponentField?.type || setting.type },
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
        return overrides?.find(o => o.key === setting?.key);
      default:
        return strategy === 'merge' ? this.merge(overrides) : overrides[0];
    }
  }

  remove (id) {
    if (!id) {
      return;
    }

    const index = this.#overrides.findIndex(Overrides.FIND_PREDICATE(id));

    if (index !== -1) {
      this.#builder?.logger.log('Removing override:', this.#overrides[index]);

      const override = this.#overrides[index];
      this.#overrides.splice(index, 1);
      this.emit('overrides.remove', this, override);
    }
  }

  merge (overrides) {
    return overrides.reduce((res, override) => {
      Object.keys(override).forEach(key => {
        if (override[key] === null || override[key] === undefined) {
          delete override[key];
        }
      });
      Object.assign(res, override);

      return res;
    }, {});
  }

  all () {
    return this.#overrides;
  }
}
