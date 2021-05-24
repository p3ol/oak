import { useContext } from 'react';
import {
  ColorPicker,
  SelectField,
  Tab,
  Tabs,
  TextField,
} from '@poool/junipero';

import { AppContext } from '../../../contexts';
import TextEditor from '../../TextEditor';

import styles from '../../Text/index.styl';

const TitleOptions = ({ element }) => {
  const { setElement } = useContext(AppContext);
  const headings = [
    { title: 'Heading 1', value: 'h1' },
    { title: 'Heading 2', value: 'h2' },
    { title: 'Heading 3', value: 'h3' },
    { title: 'Heading 4', value: 'h4' },
    { title: 'Heading 5', value: 'h5' },
    { title: 'Heading 6', value: 'h6' },
  ];
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
    <Tabs>
      <Tab title="Settings">
        <div>
          <SelectField
            label="Alignement horizontal"
            boxed={false}
            value={element.headingLevel || 'h1'}
            parseValue={item => item.value}
            parseTitle={item => item.title}
            className={styles.item}
            onChange={item => {
              setElement(element, { headingLevel: item.value });
            }}
            options={headings}
          />
          <div id="wysiwyg">
            <TextEditor
              onChange={item => {
                setElement(element, { content: item.value });
              }}
              value={element.content}
            />
          </div>
        </div>
      </Tab>
      <Tab title="Style">
        <div className={styles.flex}>
          <ColorPicker
            value={element.style?.color || '#000000'}
            onChange={item => {
              setElement(element.style, { color: item.value });
            }}
          />
          <SelectField
            label="Alignement horizontal"
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
            value={element.style?.width}
            onChange={item => {
              setElement(element.style, { width: item.value });
            }}
          />
        </div>
      </Tab>
    </Tabs>
  );
};

export default TitleOptions;
