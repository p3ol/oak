import {
  TextField,
  SelectField,
  ColorField,
} from '@poool/junipero';

import CoreImageField from './core/CoreImageField';

export const FIELD_TEXT = {
  type: 'text',
  render: (props, { field } = {}) => (
    <TextField
      { ...props }
      placeholder={field.placeholder}
      type={field.valueType || 'text'}
    />
  ),
};

export const FIELD_SELECT = {
  type: 'select',
  render: (props, { field } = {}) => (
    <SelectField
      { ...props }
      onClick={e => e.stopPropagation()}
      options={field.options}
      parseTitle={field.parseTitle || (o => o?.title || o)}
      parseValue={field.parseValue || (o => o?.value || o)}
    />
  ),
};

export const FIELD_COLOR = {
  type: 'color',
  render: (props, { field } = {}) => (
    <ColorField
      { ...props }
      placeholder={field.placeholder}
    />
  ),
};

export const FIELD_CORE_IMAGE = {
  type: 'core-image',
  render: props => (
    <CoreImageField { ...props } />
  ),
};
