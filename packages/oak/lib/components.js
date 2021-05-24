import { nanoid } from 'nanoid';
import { classNames } from '@poool/junipero-utils';

import Row from './core/Row';
import Text from './core/Text';
import Title from './core/Title';

export const COMPONENT_DEFAULT = {
  id: 'unknown',
  name: 'Unknown',
  type: 'component',
  render: ({ element, className }) => (
    <pre className={classNames('oak-unknown', className)}>
      { JSON.stringify(element) }
    </pre>
  ),
};

export const COMPONENT_ROW = {
  id: 'row',
  name: 'Row',
  type: 'component',
  render: Row,
  icon: 'view_column',
  editable: true,
  options: Row.options,
  settings: Row.settings,
  construct: () => ({
    type: 'row',
    settings: {
      alignItems: 'flex-start',
    },
    cols: [{
      type: 'col',
      content: [],
      id: nanoid(),
      style: {},
    }],
  }),
};

export const COMPONENT_TEXT = {
  id: 'text',
  name: 'Text',
  type: 'component',
  render: Text,
  icon: 'format_align_left',
  options: Text.options,
  editable: true,
  construct: () => ({
    type: 'text',
    content: 'This is some fancy text content, you can even use html here',
    settings: {},
  }),
};
export const COMPONENT_TITLE = {
  id: 'title',
  name: 'Title',
  type: 'component',
  icon: 'title',
  render: Title,
  options: Title.options,
  editable: true,
  construct: () => ({
    type: 'title',
    content: 'title',
    headingLevel: 'h1',
    settings: {},
  }),
};

export const GROUP_CORE = {
  id: 'core',
  name: 'Core components',
  type: 'group',
  components: [
    COMPONENT_ROW,
    COMPONENT_TEXT,
    COMPONENT_TITLE,
  ],
};

export const GROUP_OTHER = {
  id: 'other',
  name: 'Other',
  type: 'group',
  components: [],
};
