import {
  COMPONENT_TITLE,
  COMPONENT_TEXT,
} from './components';
import Editor from './core/Editor';

export default {
  fieldTypes: [{
    type: 'richtext',
    render: props => (
      <Editor { ...props } />
    ),
  }],
  components: [{
    group: 'core',
    component: COMPONENT_TITLE,
  }, {
    group: 'core',
    component: COMPONENT_TEXT,
  }],
};
