import { CKEditor } from '@ckeditor/ckeditor5-react';

import CustomEditor from './index';

export default {
  title: 'CKEditor5 / Custom Build',
};

export const Basic = () => (
  <CKEditor
    editor={CustomEditor}
    data="Hello from CKEditor 5!"
    config={{
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
    }}
  />
);
