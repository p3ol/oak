import { SelectField, TextField } from '@poool/junipero';
import { useContext } from 'react';

import { AppContext } from '../../../contexts';

import styles from '../index.styl';

const RowEdit = ({ element, col }) => {
  const { setElement } = useContext(AppContext);

  const vertical = [
    { title: 'Aligné en haut', value: 'flex-start' },
    { title: 'Centré', value: 'center' },
    { title: 'Aligné en bas', value: 'flex-end' },
  ];

  const horizontal = [
    { title: 'Aligné à gauche', value: 'start' },
    { title: 'Centré', value: 'center' },
    { title: 'Aligné à droite', value: 'end' },
    { title: 'Justifié', value: 'justify' },
  ];

  return (
    <>
      <SelectField
        label="Alignement vertical"
        boxed={false}
        value={col.style.content.alignItem || 'flex-start'}
        parseValue={item => item.value}
        parseTitle={item => item.title}
        className={styles.item}
        onChange={item => {
          col.style.content.alignItem = item.value;
          setElement(element, {});
        }}
        options={vertical}
      />
      <SelectField
        label="Alignement horizontal"
        boxed={false}
        value={col.style.content.textAlign || 'start'}
        parseValue={item => item.value}
        parseTitle={item => item.title}
        className={styles.item}
        onChange={item => {
          col.style.content.textAlign = item.value;
          let horizontalAlignement = '';

          if (item.value === 'start' || item.value === 'justify') {
            horizontalAlignement = 'flex-start';
          } else if (item.value === 'center') {
            horizontalAlignement = 'center';
          } else if (item.value === 'end') {
            horizontalAlignement = 'flex-end';
          }

          col.content?.map(content => {
            content.style = {
              horizontalAlignement,
            };

            return null;
          });
          setElement(element, {});
        }}
        options={horizontal}
      />
      <TextField
        boxed={false}
        placeholder="Proportion de la colonne"
        value={col.style.col.flex}
        onChange={item => {
          col.style.col.width = '';
          col.style.col.flex = item.value;
          setElement(element, {});
        }}
      />
      <TextField
        boxed={false}
        placeholder="Largeur fixe"
        value={col.style.col.width}
        onChange={item => {
          col.style.col.flex = '';
          col.style.col.width = item.value;
          setElement(element, {});
        }}
      />
    </>
  );
};

export default RowEdit;
