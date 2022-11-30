import {
  TextField,
  SelectField,
  ColorField,
  DateField,
  Toggle,
} from '@junipero/react';
import { slideInDownMenu } from '@junipero/transitions';

import CoreImageField from './core/CoreImageField';
import Text from './core/Text';

export const FIELD_TEXT = {
  type: 'text',
  deserialize: val => '' + val,
  render: (props, { field, t } = {}) => (
    <TextField
      { ...props }
      { ...field.placeholder && {
        placeholder: t(field.placeholder),
      } }
      type={field.valueType || 'text'}
    />
  ),
};

export const FIELD_TEXTAREA = {
  type: 'textarea',
  deserialize: val => '' + val,
  render: (props, { field, t } = {}) => (
    <TextField
      { ...props }
      tag="textarea"
      rows={props.rows || 5}
      { ...field.placeholder && {
        placeholder: t(field.placeholder),
      } }
      type={field.valueType || 'text'}
    />
  ),
};

export const FIELD_SELECT = {
  type: 'select',
  render: (props, { field, t } = {}) => (
    <SelectField
      { ...props }
      options={field.options}
      { ...field.placeholder && {
        placeholder: t(field.placeholder),
      } }
      animateMenu={slideInDownMenu}
      parseTitle={field.parseTitle || (o => o?.title ? t(o.title) : o)}
      parseValue={field.parseValue || (o => o?.value ?? o)}
    />
  ),
};

export const FIELD_COLOR = {
  type: 'color',
  render: (props, { field, t } = {}) => (
    <ColorField
      { ...props }
      { ...field.placeholder && {
        placeholder: t(field.placeholder),
      } }
    />
  ),
};

export const FIELD_CORE_IMAGE = {
  type: 'core-image',
  render: props => (
    <CoreImageField { ...props } />
  ),
};

export const FIELD_DATE = {
  type: 'date',
  render: (props, { field, t } = {}) => (
    <DateField
      { ...props }
      { ...field.placeholder && {
        placeholder: t(field.placeholder),
      } }
    />
  ),
};

export const FIELD_TOGGLE = {
  type: 'toggle',
  render: (props, { field } = {}) => (
    <Toggle
      { ...props }
      checkedLabel={<Text>{ field.checkedLabel }</Text>}
      uncheckedLabel={<Text>{ field.uncheckedLabel }</Text>}
    />
  ),
};

export const BASE_FIELDTYPES = [
  FIELD_TEXT, FIELD_TEXTAREA, FIELD_SELECT, FIELD_COLOR, FIELD_CORE_IMAGE,
  FIELD_DATE, FIELD_TOGGLE,
];
