import {
  TextField,
  SelectField,
  ColorField,
} from '@poool/junipero';

import CoreImageField from './core/CoreImageField';
import Text from './core/Text';

export const FIELD_TEXT = {
  type: 'text',
  render: (props, { field } = {}) => (
    <TextField
      { ...props }
      placeholder={<Text>{ field.placeholder }</Text>}
      type={field.valueType || 'text'}
    />
  ),
};

export const FIELD_SELECT = {
  type: 'select',
  render: (props, { field } = {}) => (
    <SelectField
      { ...props }
      options={field.options}
      placeholder={<Text>{ field.placeholder }</Text>}
      parseTitle={field.parseTitle ||
        (o => o?.title ? <Text>{ o.title }</Text> : o)}
      parseValue={field.parseValue || (o => o?.value || o)}
    />
  ),
};

export const FIELD_COLOR = {
  type: 'color',
  render: (props, { field } = {}) => (
    <ColorField
      { ...props }
      placeholder={<Text>{ field.placeholder }</Text>}
    />
  ),
};

export const FIELD_CORE_IMAGE = {
  type: 'core-image',
  render: props => (
    <CoreImageField { ...props } />
  ),
};
