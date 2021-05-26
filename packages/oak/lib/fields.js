import { TextField, SelectField } from '@poool/junipero';

export const FIELD_TEXT = {
  type: 'text',
  render: props => (
    <TextField { ...props } />
  ),
};

export const FIELD_SELECT = {
  type: 'select',
  render: (props, field) => (
    <SelectField
      { ...props }
      options={field.options}
      parseTitle={field.parseTitle || (o => o?.title || o)}
      parseValue={field.parseValue || (o => o?.value || o)}
    />
  ),
};
