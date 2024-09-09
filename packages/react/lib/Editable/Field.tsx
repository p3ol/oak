import type {
  ComponentObject,
  ComponentSettingsFieldObject,
  ElementObject,
  FieldObject,
  FieldOverride,
  SettingOverride,
} from '@oakjs/core';
import type {
  SpecialComponentPropsWithoutRef,
} from '@junipero/react';
import {
  type MutableRefObject,
  useMemo,
} from 'react';

import type { EditableRef } from './index';
import { useBuilder } from '../hooks';
import { assignDefined } from '../utils';

export interface FieldProps extends SpecialComponentPropsWithoutRef {
  setting: ComponentSettingsFieldObject;
  element: ElementObject;
  component: ComponentObject;
  onChange: (key: string, value: any) => void;
  onCustomChange: (key: string, field: FieldObject, value: any) => void;
  editableRef: MutableRefObject<EditableRef>;
}

const Field = ({
  setting: fieldSetting,
  element,
  component,
  onChange,
  onCustomChange,
  editableRef,
}: FieldProps) => {
  const { builder, addons, floatingsRef } = useBuilder();

  const overrides = useMemo(() => ({
    field: builder.getOverride('component', element.type, {
      output: 'field', setting: fieldSetting,
    }),
    settings: builder
      .getOverride('setting', element.type, { setting: fieldSetting }),
  }), [element, fieldSetting, addons]);

  const field = useMemo(() => (
    builder.getField(
      (overrides?.settings as SettingOverride)?.fieldType ||
      overrides?.field?.type ||
      fieldSetting?.type
    )
  ), [overrides, fieldSetting, addons]);

  const setting = useMemo(() => assignDefined<typeof fieldSetting>(
    { type: fieldSetting.type },
    fieldSetting,
    overrides.settings?.toObject?.() || overrides.settings || {},
    overrides.field?.toObject?.() || overrides.field || {},
  ), [fieldSetting, overrides, addons]);

  const fieldProps = {
    id: setting.id,
    name: setting.name,
    disabled: setting.disabled,
    value: builder.getElementSettings(element, setting.key, setting.default),
    required: setting.required,
    onChange: (overrides?.field as FieldOverride)?.onChange
      ? onCustomChange.bind(null, setting.key, overrides.field)
      : onChange.bind(null, setting.key),
    ...field?.props,
    ...(overrides.field as FieldOverride)?.props,
  };

  if (setting.condition &&
    !setting.condition(element, { component, builder })) {
    return null;
  }

  return (
    (overrides.field as FieldOverride)?.render || field?.render)?.(fieldProps, {
    onChange: onChange.bind(null, setting.key),
    field,
    setting,
    overrides: overrides.field,
    element,
    editableRef,
    floatingsRef,
    t: builder.getText.bind(builder),
  }) || null;
};

Field.displayName = 'Field';

export default Field;
