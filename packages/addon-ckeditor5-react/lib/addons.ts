import type { ReactFieldObject, AddonObject } from '@oakjs/react';
import { omit } from '@oakjs/react';
import ClassicEditor from '@oakjs/ckeditor5-build-custom';

import Field, { CKEditorFieldProps } from './Field';

export const ckeditorField = ({
  config,
  editor,
  ...props
}: CKEditorFieldProps = {}): ReactFieldObject => ({
  type: 'ckeditor',
  render: Field,
  ...omit(props, ['onChange']),
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

export const ckeditorFieldAddon = (
  props?: CKEditorFieldProps
): AddonObject => ({
  fields: [ckeditorField(props)],
});
