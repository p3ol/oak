import { serialize, deserialize } from './core/Editor/html';
import {
  COMPONENT_TITLE,
  COMPONENT_TEXT,
  COMPONENT_IMAGE,
  COMPONENT_BUTTON,
} from './components';
import Editor from './core/Editor';
import ImageField from './core/ImageField';

export default {
  fieldTypes: [{
    type: 'richtext',
    serialize,
    deserialize,
    render: (baseProps, customProps) => (
      <Editor { ...customProps } { ...baseProps } />
    ),
  }, {
    type: 'image',
    onChange: (key, { value, name }) => {
      return { name: name || '', url: value || '' };
    },
    render: props => (
      <ImageField { ...props } />
    ),
  }],
  components: [{
    group: 'core',
    component: COMPONENT_TITLE,
  }, {
    group: 'core',
    component: COMPONENT_TEXT,
  }, {
    group: 'core',
    component: COMPONENT_IMAGE,
  }, {
    group: 'core',
    component: COMPONENT_BUTTON,
  }],
};

export { default as localeFr } from './languages/fr';
