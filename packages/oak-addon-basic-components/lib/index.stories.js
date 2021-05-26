import { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import { deserialize } from './core/Editor/html';
import Editor from './core/Editor';

export default { title: 'oak-addon-basic-components' };

export const internalEditor = () => {
  const [value, setValue] = useState(deserialize(
    'This is a <strong>fancy</strong> text'));

  return (
    <>
      <Editor value={value} onChange={({ value }) => setValue(value)} />
      <p>
        Unserialized initial value: { JSON.stringify(deserialize(
          'This is a <strong>fancy</strong> text')) }
      </p>
      <p>
        Current value: { JSON.stringify(value) }
      </p>
    </>
  );
};

export const rawSlateEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([{
    type: 'paragraph',
    children: [{ text: '' }],
  }]);

  return (
    <Slate editor={editor} value={value} onChange={val => setValue(val)}>
      <Editable style={{ border: '1px solid #000' }} />
    </Slate>
  );
};
