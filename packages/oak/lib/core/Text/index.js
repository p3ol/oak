import { ColorPicker, SelectField, TextField } from '@poool/junipero';
import React, { useContext } from 'react';

import { AppContext } from '../../contexts';
import Edit from '../Edit';
import TextEditor from '../TextEditor';

import styles from './index.styl';

const Text = ({ element }) => {

  return (
    React.createElement('p', { style: {
      color: element.style?.color,
      textAlign: element.style?.textAlign,
      width: element.style?.width,
    }, dangerouslySetInnerHTML: { __html: element.content } })
  );
};

Text.options = [{
  render: ({ element }) => {
    const { setElement } = useContext(AppContext);
    const horizontal = [
      { title: 'Aligné à gauche', value: 'flex-start' },
      { title: 'Centré', value: 'center' },
      { title: 'Aligné à droite', value: 'flex-end' },
    ];

    const textAlign = [
      { title: 'Aligné à gauche', value: 'start' },
      { title: 'Centré', value: 'center' },
      { title: 'Aligné à droite', value: 'end' },
      { title: 'Justifié', value: 'justify' },
    ];

    return (
      <Edit title='Text options'>
        <ColorPicker
          value={element.style?.color || '#000000'}
          placeholder='Couleur du texte'
          label='Couleur du texte'
          onChange={item => {
            setElement(element.style, { color: item.value });
          }}
        />
        <SelectField
          label="Alignement horizontal"
          placeholder="Alignement horizontal"
          boxed={false}
          value={element.style?.horizontalAlignement || 'flex-start'}
          parseValue={item => item.value}
          parseTitle={item => item.title}
          className={styles.item}
          onChange={item => {
            setElement(element.style, { horizontalAlignement: item.value });
          }}
          options={horizontal}
        />
        <SelectField
          label="Alignement texte"
          placeholder="Alignement texte"
          boxed={false}
          value={element.style?.textAlign || 'start'}
          parseValue={item => item.value}
          parseTitle={item => item.title}
          className={styles.item}
          onChange={item => {
            setElement(element.style, { textAlign: item.value });
          }}
          options={textAlign}
        />
        <TextField
          boxed={false}
          placeholder="Largeur fixe"
          label="Largeur fixe"
          value={element.style?.width}
          onChange={item => {
            setElement(element.style, { width: item.value });
          }}
        />
        <div id="wysiwyg">
          <TextEditor
            onChange={item => {
              setElement(element, { content: item.value });
            }}
            value={element.content} />
        </div>
      </Edit>
    );
  },
}];
export default Text;
