import Text from './core/Text';
import Title from './core/Title';
import { serialize, deserialize } from './core/Editor/html';

export const COMPONENT_TITLE = {
  id: 'title',
  name: 'Title',
  type: 'component',
  icon: 'title',
  render: Title,
  options: Title.options,
  settings: Title.settings,
  editable: true,
  construct: () => ({
    type: 'title',
    content: 'This is a title',
    headingLevel: 'h1',
    settings: {},
  }),
};

export const COMPONENT_TEXT = {
  id: 'text',
  name: 'Text',
  type: 'component',
  render: Text,
  icon: 'format_align_left',
  options: Text.options,
  settings: Text.settings,
  editable: true,
  serialize,
  deserialize,
  construct: () => ({
    type: 'text',
    content: 'This is some fancy text content, you can even use ' +
      '<strong>html</strong> here',
    settings: {},
  }),
};
