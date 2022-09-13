import { v4 as uuid } from 'uuid';

import Row from './core/Row';
import Foldable from './core/Foldable';
import EmptySpace from './core/EmptySpace';

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

export const COMPONENT_FOLDABLE = {
  id: 'foldable',
  name: t => t('core.components.foldable.name', 'Foldable'),
  type: 'component',
  render: Foldable,
  icon: 'unfold_less',
  editable: true,
  options: Foldable.options,
  settings: Foldable.settings,
  construct: () => ({
    type: 'foldable',
    settings: {
      alignItems: 'flex-start',
    },
    cols: [{
      type: 'col',
      content: [],
      id: uuid(),
      style: {},
    }],
    seeMore: [{
      type: 'col',
      content: [{
        type: 'text',
        id: uuid(),
        content: '<div style="text-align: center">see more</div>',
      }],
      id: uuid(),
      style: {},
    }],
    seeLess: [{
      type: 'col',
      content: [{
        type: 'text',
        id: uuid(),
        content: '<div style="text-align: center">see less</div>',
      }],
      id: uuid(),
      style: {},
    }],
  }),
};

export const COMPONENT_EMPTY_SPACE = {
  id: 'empty-space',
  name: t => t('core.components.emptySpace.name', 'Blank space'),
  type: 'component',
  render: EmptySpace,
  icon: 'view_comfy',
  options: [],
  settings: EmptySpace.settings,
  editable: true,
  construct: () => ({
    type: 'empty-space',
    styles: {},
    settings: {
      height: '32px',
      className: '',
    },
  }),
};

export const GROUP_CORE = {
  id: 'core',
  name: t => t('core.groups.core.title', 'Core components'),
  type: 'group',
  components: [
    COMPONENT_FOLDABLE,
    COMPONENT_ROW,
    COMPONENT_EMPTY_SPACE,
  ],
};

export const GROUP_OTHER = {
  id: 'other',
  name: t => t('core.groups.other.title', 'Other'),
  type: 'group',
  components: [],
};
