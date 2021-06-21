import { serialize, deserialize, isSerialized } from './core/Editor/html';
import Text from './core/Text';
import Title from './core/Title';
import Image from './core/Image';
import Button from './core/Button';

export const COMPONENT_TITLE = {
  id: 'title',
  name: t => t('addons.basicComponents.components.title.name', 'Title'),
  type: 'component',
  icon: 'title',
  render: Title,
  options: Title.options,
  settings: Title.settings,
  editable: true,
  serialize: element => ({
    content: serialize(element.content),
  }),
  deserialize: element => ({
    content: deserialize(element.content),
  }),
  isSerialized: element => isSerialized(element.content),
  construct: () => ({
    type: 'title',
    content: 'This is a title',
    headingLevel: 'h1',
    settings: {},
  }),
};

export const COMPONENT_TEXT = {
  id: 'text',
  name: t => t('addons.basicComponents.components.text.name', 'Text'),
  type: 'component',
  render: Text,
  icon: 'format_align_left',
  options: Text.options,
  settings: Text.settings,
  editable: true,
  serialize: element => ({
    content: serialize(element.content),
  }),
  deserialize: element => ({
    content: deserialize(element.content),
  }),
  isSerialized: element => isSerialized(element.content),
  construct: () => ({
    type: 'text',
    content: 'This is some fancy text content, you can even use ' +
      '<strong>html</strong> here',
    settings: {},
  }),
};

export const COMPONENT_IMAGE = {
  id: 'image',
  name: t => t('addons.basicComponents.components.image.name', 'Image'),
  type: 'component',
  render: Image,
  icon: 'image',
  options: Image.options,
  settings: Image.settings,
  editable: true,
  construct: () => ({
    type: 'image',
    url: '',
    name: '',
    settings: {},
  }),
};

export const COMPONENT_BUTTON = {
  id: 'button',
  name: t => t('addons.basicComponents.components.button.name', 'Button'),
  type: 'component',
  render: Button,
  icon: 'view_comfy',
  options: Button.options,
  settings: Button.settings,
  editable: true,
  serialize: element => ({
    content: serialize(element.content),
  }),
  deserialize: element => ({
    content: deserialize(element.content),
  }),
  isSerialized: element => isSerialized(element.content),
  construct: () => ({
    type: 'button',
    content: 'Click me!',
    action: 'link',
    url: '',
    settings: {
      buttonType: 'button',
    },
  }),
};
