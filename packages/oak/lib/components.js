import React from 'react';

import Row from './core/Row';

export const COMPONENT_DEFAULT = {
  id: 'unknown',
  name: 'Unknown',
  type: 'component',
  render: (elmt, props) => (
    <pre {...props}>{ JSON.stringify(elmt) }</pre>
  ),
};

export const COMPONENT_ROW = {
  id: 'row',
  name: 'Row',
  type: 'component',
  render: (elmt, props) => (
    <Row element={elmt} {...props} />
  ),
  construct: () => ({
    type: 'row',
    cols: [{ size: 12, content: [] }],
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
