import {
  type ComponentPropsWithoutRef,
  type RefObject,
  useMemo,
} from 'react';
import {
  type ComponentObject,
  type ComponentSettingsFieldObject,
  type ElementObject,
  type FieldObject,
  type FieldOverride,
  type SettingOverride,
  assignDefined,
} from '@oakjs/core';
import { omit } from '@junipero/react';

import type { EditableRef } from './index';
import { useBuilder } from '../hooks';
import DynamicComponent from '../DynamicComponent';

export interface FieldProps extends ComponentPropsWithoutRef<any> {
  setting: ComponentSettingsFieldObject;
  element: ElementObject;
  component: ComponentObject;
  onChange: (key: string, value: any) => void;
  onCustomChange: (key: string, field: FieldObject, value: any) => void;
  editableRef: RefObject<EditableRef>;
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
    }) as FieldOverride,
    settings: builder.getOverride('setting', element.type, {
      setting: fieldSetting,
    }) as SettingOverride,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [element, fieldSetting, builder, addons]);

  const field = useMemo(() => (
    builder.getField(
      overrides?.settings?.fieldType ||
      overrides?.field?.type ||
      fieldSetting?.type
    )
  ), [overrides, fieldSetting, builder]);

  const setting = useMemo(() => assignDefined<typeof fieldSetting>(
    { type: fieldSetting.type },
    fieldSetting,
    overrides.field?.toObject?.() || overrides.field || {} as FieldOverride,
    omit(
      overrides.settings?.toObject?.() || overrides.settings ||
        {} as SettingOverride,
      ['key']
    ),
  ), [fieldSetting, overrides]);

  const fieldProps = {
    id: setting.id,
    name: setting.name,
    disabled: setting.disabled,
    value: builder.getElementSettings(
      element,
      fieldSetting.key,
      typeof setting.default === 'function'
        ? setting.default(element, { builder }) : setting.default,
    ),
    required: setting.required,
    onChange: overrides?.field?.onChange
      ? onCustomChange.bind(null, setting.key, overrides.field)
      : onChange.bind(null, setting.key),
    ...field?.props,
    ...setting?.props,
    ...overrides.field?.props,
    ...overrides.settings?.props,
  };

  if (setting.condition &&
    !setting.condition(element, { component, builder })) {
    return null;
  }

  return (
    <DynamicComponent
      renderer={
        overrides.field?.render ||
        field?.render
      }
      { ...fieldProps }
      fieldOptions={{
        onChange: onChange.bind(null, fieldSetting.key),
        field,
        setting,
        overrides: overrides.field,
        element,
        editableRef,
        floatingsRef,
        t: builder.getText.bind(builder),
      }}
    />
  );
};

Field.displayName = 'Field';

export default Field;
