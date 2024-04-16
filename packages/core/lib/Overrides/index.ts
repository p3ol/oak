import { omit } from '@junipero/core';

import { ComponentOverride, ComponentOverrideObject, ComponentSettingsField, FieldOverride, FieldOverrideObject, SettingOverride } from '../types';
import Emitter from '../Emitter';
import Builder from '../Builder';

export declare class IOverrides {
  constructor(options?: { builder: Builder });

  /** Adds a new component or field override */
  add(
    override: ComponentOverride | ComponentOverrideObject | FieldOverride |
      FieldOverrideObject
  ): ComponentOverride | FieldOverride;

  /**
   * Retrieves an override for a component or a field.
   * If the override type is 'component' and the output is set to 'field',
   * the override will be returned as a field override object, potentially
   * using a component setting field as base.
   *
   * Example:
   * this.get('component', 'title', {
   *   output: 'field',
   *   setting: new ComponentSettingsField({
   *     key: 'content',
   *     type: 'textarea',
   *   }),
   * })
   *
   * Will result in:
   * {
   *   type: 'textarea',
   *   render: () => ...,
   * }
   * */
  get(type: 'component' | 'field' | 'setting', target: string, options?: {
    output?: 'field',
    setting?: ComponentSettingsField,
  }): ComponentOverride | FieldOverrideObject;

  /** Removes an override by its id (if available) */
  remove (id: string): void;

  /** Merges overrides into a single non-typed object */
  merge(overrides: Array<ComponentOverride | FieldOverride>): object;

  /** Returns all available overrides */
  all(): Array<ComponentOverride | FieldOverride>;
}

export default class Overrides extends Emitter implements IOverrides {
  static FIND_PREDICATE = id => o => id ? o.id === id : null;

  #overrides = [];
  #builder = null;

  constructor ({ builder }: { builder?: Builder } = {}) {
    super();

    this.#builder = builder;
  }

  add (
    override: ComponentOverride |
      ComponentOverrideObject |
      FieldOverride |
      FieldOverrideObject
  ) {
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

      return override as ComponentOverride | FieldOverride;
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

    return override as ComponentOverride | FieldOverride;
  }

  get (
    overrideType: 'component' | 'field' | 'setting',
    target: string,
    {
      output,
      setting,
    }: {
      output?: 'field',
      setting?: ComponentSettingsField
    } = {}
  ) {
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

  remove (id: string) {
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

  merge (overrides: Array<ComponentOverride | FieldOverride>) {
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
