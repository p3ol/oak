import { omit } from '@junipero/core';
import { Component } from 'react';

import { ComponentOverride, ComponentOverrideObject, ComponentSettingsField, ComponentSettingsFieldObject, FieldOverride, FieldOverrideObject, SettingOverride, SettingOverrideObject } from '../types';
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
    setting?: ComponentSettingsFieldObject,
  }): ComponentOverride | FieldOverride | SettingOverride;

  /** Removes an override by its id (if available) */
  remove (id: string): void;

  /** Merges overrides into a single non-typed object */
  merge(overrides: Array<ComponentOverride | FieldOverride | SettingOverride>):
    ComponentOverride | FieldOverride | SettingOverride;

  /** Returns all available overrides */
  all(): Array<ComponentOverride | FieldOverride | SettingOverride>;
}

export default class Overrides extends Emitter implements IOverrides {
  static FIND_PREDICATE = (id: string) => (
    o: ComponentOverride |
    FieldOverride |
    SettingOverride
  ) => id ? o.id === id : null;

  #overrides: Array<FieldOverride | ComponentOverride | SettingOverride> = [];
  #builder: Builder = null;

  constructor ({ builder }: { builder?: Builder } = {}) {
    super();

    this.#builder = builder;
  }

  add (
    override:
      ComponentOverrideObject |
      FieldOverrideObject |
      SettingOverrideObject
  ) {
    const existing = this.#overrides
      .find(Overrides.FIND_PREDICATE(override.id));
    let override_: ComponentOverride | SettingOverride | FieldOverride;

    switch (override.type) {
      case 'component':
        override_ = new ComponentOverride(override as ComponentOverrideObject);
        break;
      case 'field':
        override_ = new FieldOverride(override as FieldOverrideObject);
        break;
      case 'setting':
        override_ = new SettingOverride(override as SettingOverrideObject);
        break;
    }

    if (existing) {
      this.#builder?.logger.log(
        'Override already exists, updating definition.',
        'Old:', existing,
        'New:', override
      );

      this.#overrides.splice(this.#overrides.indexOf(existing), 1, override_);
      this.emit('overrides.update', override);

      return override as ComponentOverride | FieldOverride;
    }

    this.#overrides.unshift(override_);

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
      output?: 'field', //TODO repair
      setting?: ComponentSettingsFieldObject
    } = {}
  ): FieldOverride | ComponentOverride | SettingOverride {
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
            const newComponentField = (override as ComponentOverride)?.fields
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
        return overrides?.find((o: SettingOverride) => o.key === setting?.key);
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

  merge (
    overrides: Array<ComponentOverride | FieldOverride | SettingOverride>
  ): FieldOverride | ComponentOverride | SettingOverride {
    return overrides.reduce((res, override) => {
      Object.keys(override).forEach((key: string) => {
        if (
          (override as any)[key] === null ||
          (override as any)[key as any] === undefined) {
          delete (override as any)[key];
        }
      });
      Object.assign(res, override);

      return res;
    }, {} as FieldOverride | ComponentOverride | SettingOverride);
  }

  all () {
    return this.#overrides;
  }
}
