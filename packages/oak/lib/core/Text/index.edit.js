import {
  ColorPicker,
  SelectField,
  Tab,
  Tabs,
  TextField,
} from '@poool/junipero';

import { useBuilder } from '../../../hooks';
import TextEditor from '../../TextEditor';

const TextOptions = ({ element }) => {
  const { setElement } = useBuilder();

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
        <div id="wysiwyg">
          <TextEditor
            onChange={item => {
              setElement(element, { content: item.value });
            }}
            value={element.content}
          />
        </div>
      </Tab>
      <Tab title="Style">
        <div className="oak-flex">
          <ColorPicker
            value={element.style?.color || '#000000'}
            placeholder="Couleur du texte"
            label="Couleur du texte"
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
            className="oak-field"
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
            className="oak-field"
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
        </div>
      </Tab>
    </Tabs>
  );
};

export default TextOptions;
