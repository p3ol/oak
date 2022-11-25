import { useState } from 'react';
import { SelectField } from '@poool/junipero';

import Editor from './core/Editor';

export default { title: 'oak-addon-richtext-field-prosemirror' };

export const classicEditor = () => {
  const [value, setValue] = useState(
    '<span style="text-decoration: underline; font-weight:bold;' +
    'font-size:40px;color:#FF0000;">Meilleure offre</span>'
  );

  const onChange = ({ value }) => {
    setValue(value);
  };

  return (
    <Editor
      value={value}
      onChange={onChange}
      options={{ debug: true }}
    />
  );
};

export const titleEditor = () => {
  const [value, setValue] = useState(
    'This is a <strong>fancy</strong> text<br />with a line break'
  );
  const [headingLevel, setHeadingLevel] = useState('h1');
  const options = Array.from(
    { length: 6 },
    (_, k) => ({ value: `h${k + 1}`, title: `heading ${k + 1}` })
  );

  const onChange = ({ value }) => {
    setValue(value);
  };

  return (
    <div className="oak">
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
    </div>
  );
};
