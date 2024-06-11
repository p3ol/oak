import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor.js';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat.js';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';

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
