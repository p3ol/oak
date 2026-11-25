import type {
  Builder,
  ComponentOverride,
  ComponentSettingsFieldObject,
} from '@oakjs/core';

const keysOf = (field: ComponentSettingsFieldObject): any[] =>
  [].concat(field?.key ?? []);

/**
 * Appends the fields that are only defined inside a component override (the
 * other ones are merged with their original field when rendered)
 */
export const withOverrideFields = (
  builder: Builder,
  type: string,
  fields: ComponentSettingsFieldObject[],
): ComponentSettingsFieldObject[] => {
  const override = builder.getOverride('component', type) as ComponentOverride;

  return fields.concat(override?.fields?.filter(f =>
    !fields.find(s =>
      s.type !== 'tab' && (
        s.key === f.key || keysOf(s).some(k => keysOf(f).includes(k))
      )
    )
  ) || []);
};

/**
 * Priority of a field, which can be changed by setting & component overrides
 */
export const getFieldPriority = (
  builder: Builder,
  type: string,
  field: ComponentSettingsFieldObject,
): number => {
  const fieldOverride: { priority?: number } = {
    ...builder.getOverride('setting', type, { setting: field }),
    ...builder.getOverride('component', type, {
      output: 'field', setting: field,
    }),
  };

  return Number.isSafeInteger(fieldOverride?.priority)
    ? fieldOverride.priority
    : field.priority || 0;
};

/**
 * Sorts fields by priority (highest first)
 */
export const sortFields = (
  builder: Builder,
  type: string,
  fields: ComponentSettingsFieldObject[],
) => [...fields].sort((a, b) =>
  getFieldPriority(builder, type, b) - getFieldPriority(builder, type, a)
);
