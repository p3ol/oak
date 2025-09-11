import {
  type EditorConfig,
  ClassicEditor,
  Alignment,
  BlockQuote,
  Bold,
  Essentials,
  FontColor,
  FontSize,
  HorizontalLine,
  Indent,
  Link,
  List,
  Paragraph,
  RemoveFormat,
  Italic,
  Strikethrough,
  Underline,
  Table,
  TableToolbar,
  TextTransformation,
} from 'ckeditor5';

import ColorPlugin from '../ColorPlugin';

class Editor extends ClassicEditor {
  static builtinPlugins = [
    Alignment,
    BlockQuote,
    Bold,
    Essentials,
    FontColor,
    FontSize,
    HorizontalLine,
    Indent,
    Italic,
    Link,
    List,
    Paragraph,
    RemoveFormat,
    Strikethrough,
    Table,
    TableToolbar,
    TextTransformation,
    Underline,
    ColorPlugin,
  ];

  static defaultConfig: EditorConfig = {
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
    language: 'en',
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
      ],
    },
  };
}

export default Editor;

export type {
  Editor,
  ClassicEditor,
};
