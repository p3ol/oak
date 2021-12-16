import {
  COMPONENT_TITLE,
  COMPONENT_TEXT,
  COMPONENT_IMAGE,
  COMPONENT_BUTTON,
} from './components';
import ImageField from './core/ImageField';

export default {
  fieldTypes: [{
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
