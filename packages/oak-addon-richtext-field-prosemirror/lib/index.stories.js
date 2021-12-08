import { useState } from 'react';
import { SelectField } from '@poool/junipero';

import Editor from './core/Editor';

export default { title: 'oak-addon-richtext-field-prosemirror' };

export const classicEditor = () => {
  const [value, setValue] = useState('This is a <strong>fancy</strong> text<br />with a line break');

  const onChange = ({ value }) => {
    setValue(value);
  };

  return (
    <Editor
      value={value}
      onChange={onChange}
    />
  );
};

export const titleEditor = () => {
  const [value, setValue] = useState('This is a <strong>fancy</strong> text<br />with a line break');
  const [headingLevel, setHeadingLevel] = useState('h1');
  const options = Array.from(
    { length: 6 },
    (v, k) => ({ value: `h${k + 1}`, title: `heading ${k + 1}` })
  );

  const onChange = ({ value }) => {
    setValue(value);
  };

  return (
    <>
      <SelectField
        options={options}
        placeholder="Choose one item"
        parseTitle={v => v.title}
        onChange={({ value }) => setHeadingLevel(value.value)}
      />
      <Editor
        value={value}
        onChange={onChange}
        element={{ type: 'title', headingLevel }}
      />
    </>
  );
};
