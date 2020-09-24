import Row from './core/Row';

export const COMPONENT_ROW = {
  id: 'row',
  name: 'Row',
  type: 'component',
  construct: () => ({
    type: 'row',
    cols: [{ size: 12, content: [] }],
    render: Row,
  }),
};

export const GROUP_CORE = {
  id: 'core',
  name: 'Core components',
  type: 'group',
  components: [
    COMPONENT_ROW,
  ],
};

export const GROUP_OTHER = {
  id: 'other',
  name: 'Other',
  type: 'group',
  components: [],
};
