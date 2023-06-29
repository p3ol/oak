import ClassicEditor from '@oakjs/ckeditor5-build-custom';

import Field from './Field';

export const ckeditorField = ({ config, editor, ...props } = {}) => ({
  type: 'ckeditor',
  render: Field,
  ...props,
  props: {
    editor: editor || ClassicEditor,
    config: {
      ...config,
      link: {
        decorators: {
          openInNewTab: {
            mode: 'manual',
            label: 'Open in a new tab',
            defaultValue: false,
            attributes: {
              target: '_blank',
              rel: 'noopener noreferrer',
            },
          },
        },
      },
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'bold',
          'italic',
          'strikethrough',
          'underline',
          'link',
          'fontColor',
          'fontSize',
          'bulletedList',
          'numberedList',
          '|',
          'removeFormat',
          '|',
          'outdent',
          'indent',
          'alignment',
          '|',
          'horizontalLine',
          'blockQuote',
          'insertTable',
        ],
      },
    },
  },
});

export const ckeditorFieldAddon = props => ({
  fields: [ckeditorField(props)],
});
