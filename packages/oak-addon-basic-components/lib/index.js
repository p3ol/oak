import {
  COMPONENT_TITLE,
  COMPONENT_TEXT,
  COMPONENT_IMAGE,
} from './components';
import Editor from './core/Editor';
import ImageField from './core/ImageField';

export default {
  fieldTypes: [{
    type: 'richtext',
    render: props => (
      <Editor { ...props } />
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
  }],
};
