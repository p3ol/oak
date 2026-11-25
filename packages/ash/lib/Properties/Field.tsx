import {
  type ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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

import type { FieldCollaborator, FieldSelection } from '../types';
import { useBuilder, useEditor } from '../hooks';
import { getCollaboratorColor } from '../collaborators';
import DynamicComponent from '../DynamicComponent';

export interface FieldProps extends ComponentPropsWithoutRef<any> {
  setting: ComponentSettingsFieldObject;
  element: ElementObject;
  component: ComponentObject;
  onChange: (key: string, value: any) => void;
  onCustomChange: (key: string, field: FieldObject, value: any) => void;
}

const Field = ({
  setting: fieldSetting,
  element,
  component,
  onChange,
  onCustomChange,
}: FieldProps) => {
  const { builder, addons, floatingsRef } = useBuilder();
  const { collaborators, setCursor } = useEditor();

  // Page settings are edited on a pseudo element without id
  const elementId = element.type === 'page'
    ? null : (element.id as string) ?? null;
  // Settings can have several keys
  const key = Array.isArray(fieldSetting.key)
    ? fieldSetting.key.join(',') : fieldSetting.key;

  // Other users whose cursor is in this field
  const fieldCollaborators = useMemo<FieldCollaborator[]>(() => collaborators
    .filter(c => c.cursor && c.cursor.key === key &&
      (c.cursor.elementId ?? null) === elementId)
    .map(c => ({
      id: c.id,
      name: c.name,
      color: getCollaboratorColor(c),
      anchor: c.cursor.anchor,
      head: c.cursor.head,
    })), [collaborators, elementId, key]);

  // Local cursor, cleared when the field is removed (e.g. the element is
  // unselected) while holding it
  const hasCursor = useRef(false);

  const onSelectionChange = useCallback((selection: FieldSelection | null) => {
    hasCursor.current = !!selection;
    setCursor(selection ? { ...selection, elementId, key } : null);
  }, [setCursor, elementId, key]);

  useEffect(() => () => {
    if (hasCursor.current) {
      setCursor(null);
    }
  }, [setCursor]);

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
        floatingsRef,
        t: builder.getText.bind(builder),
        collaborators: fieldCollaborators,
        onSelectionChange,
      }}
    />
  );
};

Field.displayName = 'Field';

export default Field;
