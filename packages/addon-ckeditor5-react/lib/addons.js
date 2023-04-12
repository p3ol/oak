import Field from './Field';

export const ckeditorField = props => ({
  type: 'ckeditor',
  render: Field,
  ...props,
});

export const ckeditorFieldAddon = props => ({
  fields: [ckeditorField(props)],
});
