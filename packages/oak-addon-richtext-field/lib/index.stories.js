import { useMemo, useState } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import '../../oak/lib/index.styl';

import { deserialize, serialize } from './core/Editor/html';
import Editor from './core/Editor';

export default { title: 'oak-addon-richtext-field' };

export const internalEditor = () => {
  const [value, setValue] = useState(deserialize(
    'This is a <strong>fancy</strong> text<br />with a line break'));

  const onChange = ({ value }) => {
    setValue(value);
  };

  return (
    <>
      <Editor
        value={value}
        onChange={onChange}
      />
      <div>
        Current value:
        <pre>{ JSON.stringify(value, null, 2) }</pre>
      </div>
      <div>
        Serialized value:
        <pre>{ JSON.stringify(serialize(value), null, 2)}</pre>
      </div>
      <div>
        Deserialized serialized value: { ' ' }
        <pre>{ JSON.stringify(deserialize(serialize(value)), null, 2) }</pre>
      </div>
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
