import {
  TextField,
  SelectField,
  ColorField,
  DateField,
  Toggle,
} from '@junipero/react';
import { slideInDownMenu } from '@junipero/transitions';

import ImageField from './ImageField';
import Text from './Text';

export const FIELD_TEXT = {
  type: 'text',
  deserialize: val => '' + val,
  render: (fieldProps, { setting, t } = {}) => (
    <TextField
      { ...fieldProps }
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
      type={setting.valueType || 'text'}
    />
  ),
};

export const FIELD_TEXTAREA = {
  type: 'textarea',
  deserialize: val => '' + val,
  render: (fieldProps, { setting, t } = {}) => (
    <TextField
      { ...fieldProps }
      tag="textarea"
      rows={fieldProps.rows || 5}
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
      type={setting.valueType || 'text'}
    />
  ),
};

export const FIELD_SELECT = {
  type: 'select',
  render: (fieldProps, { setting, editableRef, t } = {}) => (
    <SelectField
      clearable={false}
      { ...fieldProps }
      options={setting.options}
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
      animateMenu={slideInDownMenu}
      parseTitle={setting.parseTitle || (o => o?.title ? t(o.title) : o)}
      parseValue={setting.parseValue || (o => o?.value ?? o)}
      container={editableRef.current}
    />
  ),
};

export const FIELD_COLOR = {
  type: 'color',
  render: (fieldProps, { setting, t } = {}) => (
    <ColorField
      { ...fieldProps }
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
    />
  ),
};

export const FIELD_IMAGE = {
  type: 'image',
  render: (fieldProps, { setting }) => (
    <ImageField
      { ...fieldProps }
      iconOnly={setting?.props?.iconOnly}
    />
  ),
};

export const FIELD_DATE = {
  type: 'date',
  render: (fieldProps, { setting, t } = {}) => (
    <DateField
      { ...fieldProps }
      { ...setting.placeholder && {
        placeholder: t(setting.placeholder),
      } }
    />
  ),
};

export const FIELD_TOGGLE = {
  type: 'toggle',
  render: (fieldProps, { setting } = {}) => (
    <Toggle { ...fieldProps } checked={fieldProps.value}>
      <Text>
        { fieldProps.value
          ? setting.checkedLabel
          : setting.uncheckedLabel }
      </Text>
    </Toggle>
  ),
};

export const BASE_FIELDTYPES = [
  FIELD_TEXT, FIELD_TEXTAREA, FIELD_SELECT, FIELD_COLOR,
  FIELD_DATE, FIELD_TOGGLE, FIELD_IMAGE,
];
