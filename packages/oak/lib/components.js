import { v4 as uuid } from 'uuid';

import Row from './core/Row';

export const COMPONENT_ROW = {
  id: 'row',
  name: t => t('core.components.row.name', 'Row'),
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
      id: uuid(),
      style: {},
    }],
  }),
};

export const GROUP_CORE = {
  id: 'core',
  name: t => t('core.groups.core.title', 'Core components'),
  type: 'group',
  components: [
    COMPONENT_ROW,
  ],
};

export const GROUP_OTHER = {
  id: 'other',
  name: t => t('core.groups.other.title', 'Other'),
  type: 'group',
  components: [],
};
