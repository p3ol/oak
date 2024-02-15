import { Editor } from '@ckeditor/ckeditor5-core';
import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig';

declare interface ckeditorFieldType {
  type: 'ckeditor',
  render: () => any,
  [_: string]: any,
  props: {
    editor: Editor
    config: EditorConfig
  }
}

declare interface ckeditorFieldProps {
    config?: EditorConfig,
    editor?: Editor,
    [_: string]: any
}

declare interface ckeditorFieldAddonType {
  fields: Array<ckeditorFieldType>,
}

declare function ckeditorField(
  props: ckeditorFieldProps
): ckeditorFieldType;

declare function ckeditorFieldAddon(
  props: ckeditorFieldProps
): ckeditorFieldAddonType;

export {
  ckeditorField,
  ckeditorFieldAddon,
  ckeditorFieldType,
  ckeditorFieldProps,
  ckeditorFieldAddonType,
};
