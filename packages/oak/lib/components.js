import { nanoid } from 'nanoid';

import Row from './core/Row';
import Text from './core/Text';
import Title from './core/Title';

export const COMPONENT_DEFAULT = {
  id: 'unknown',
  name: 'Unknown',
  type: 'component',
  render: ({ element, ...props }) => (
    <pre {...props}>{ JSON.stringify(element) }</pre>
  ),
};

export const COMPONENT_ROW = {
  id: 'row',
  name: 'Row',
  type: 'component',
  render: Row,
  icon: 'view_column',
  options: [],
  construct: () => ({
    type: 'row',
    style: {
      alignItems: 'flex-start',
    },
    cols: [{
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
  construct: () => ({
    type: 'text',
    /* eslint-disable */
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
    /* eslint-enable */
    style: {},
  }),
};
export const COMPONENT_TITLE = {
  id: 'title',
  name: 'Title',
  type: 'component',
  icon: 'title',
  render: Title,
  options: Title.options,
  construct: () => ({
    type: 'title',
    content: 'title',
    headingLevel: 'h1',
    style: {},
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
