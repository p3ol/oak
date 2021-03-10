import { SelectField, TextField, ColorPicker } from '@poool/junipero';
import React, { useContext } from 'react';

import { AppContext } from '../../contexts';
import Edit from '../Edit';

import styles from '../Text/index.styl';

const Title = ({ element }) => {
  const { setElement } = useContext(AppContext);

  return (
    element.headingLevel === 1
      ? <h1 style={{ color: element.style.color }}>{element.content}</h1>
      : element.headingLevel === 2
        ? <h2 style={{ color: element.style.color }}>{element.content}</h2>
        : element.headingLevel === 3
          ? <h3 style={{ color: element.style.color }}>{element.content}</h3>
          : <h4 style={{ color: element.style.color }}>{element.content}</h4>
  );
};

Title.options = [{
  render: ({ element }) => {
    const { setElement } = useContext(AppContext);
    const headings = [
      { title: 'Heading 1', value: 1 },
      { title: 'Heading 2', value: 2 },
      { title: 'Heading 3', value: 3 },
      { title: 'Heading 4', value: 4 },
    ];

    return (
      <Edit title='Title options'>
        <SelectField
          label="Alignement horizontal"
          boxed={false}
          value={element.headingLevel || 1}
          parseValue={item => item.value}
          parseTitle={item => item.title}
          className={styles.item}
          onChange={item => {
            setElement(element, { headingLevel: item.value });

            return null;
          }}
          options={headings}
        />
        <TextField
          rows={1}
          required={true}
          boxed={false}
          placeholder="Content"
          value={element.content}
          onChange={item => {
            setElement(element, { content: item.value });
          }}
        />
        <ColorPicker
          value={element.style?.color || '#000000'}
          onChange={item => {
            setElement(element, { style: { color: item.value } });
          }}
        />
      </Edit>
    );
  },
}];
export default Title;
