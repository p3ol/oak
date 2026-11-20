import type { EditorConfig } from 'ckeditor5';
import type { ReactFieldObject, AddonObject } from '@oakjs/react';
import { omit } from '@oakjs/react';

import Field, { CKEditorFieldProps } from './Field';

const DEFAULT_TOOLBAR_ITEMS = [
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
];

/**
 * Toolbar items are wrapped on several lines instead of being grouped in a
 * "show more items" dropdown: grouping relies on a ResizeObserver that
 * resizes the toolbar it observes, which triggers "ResizeObserver loop"
 * errors in narrow containers (like a builder's sidebar).
 * Toolbar options & items can still be customized with `config.toolbar`.
 */
const getToolbarConfig = (
  toolbar: EditorConfig['toolbar'],
): EditorConfig['toolbar'] => ({
  shouldNotGroupWhenFull: true,
  ...!Array.isArray(toolbar) && toolbar,
  items: Array.isArray(toolbar)
    ? toolbar
    : toolbar?.items || DEFAULT_TOOLBAR_ITEMS,
});

export const ckeditorField = ({
  config,
  editor,
  ...props
}: CKEditorFieldProps = {}): ReactFieldObject => ({
  type: 'ckeditor',
  render: Field,
  ...omit(props, ['onChange']),
  props: {
    editor,
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
      toolbar: getToolbarConfig(config?.toolbar),
    },
  },
});

export const ckeditorFieldAddon = (
  props?: CKEditorFieldProps
): AddonObject => ({
  fields: [ckeditorField(props)],
});
