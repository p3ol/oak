import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { Bold } from '@ckeditor/ckeditor5-basic-styles';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FontColor, FontSize } from '@ckeditor/ckeditor5-font';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { Indent } from '@ckeditor/ckeditor5-indent';
import {  } from '@ckeditor/ckeditor5-basic-styles';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import {
  Italic,
  Strikethrough,
  Underline,
} from '@ckeditor/ckeditor5-basic-styles';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';

import ColorPlugin from './ColorPlugin';

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

  static defaultConfig = {
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
