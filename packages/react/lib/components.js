import Row from './Row';
// import Foldable from './core/Foldable';
// import EmptySpace from './core/EmptySpace';

export const COMPONENT_ROW = {
  id: 'row',
  name: t => t('core.components.row.name', 'Row'),
  type: 'component',
  render: Row,
  icon: 'row',
  draggable: false,
  droppable: false,
  hasCustomInnerContent: true,
  editable: true,
  options: Row.options,
  settings: Row.settings,
  getContainers: element => [element.cols],
  sanitize: ({ builder } = {}, element) => ({
    ...element,
    cols: !element.cols || !element.cols.length ? [{
      type: 'col',
      content: [],
      id: builder.generateId(),
      style: {},
    }] : element.cols,
  }),
  construct: ({ builder } = {}) => ({
    type: 'row',
    settings: {
      alignItems: 'flex-start',
    },
    cols: [{
      type: 'col',
      content: [],
      id: builder.generateId(),
      style: {},
    }],
  }),
};

// export const COMPONENT_FOLDABLE = {
//   id: 'foldable',
//   name: t => t('core.components.foldable.name', 'Foldable'),
//   type: 'component',
//   render: Foldable,
//   icon: 'unfold_less',
//   editable: true,
//   options: Foldable.options,
//   settings: Foldable.settings,
//   construct: () => ({
//     type: 'foldable',
//     settings: {},
//     content: [],
//     seeMore: [],
//     seeLess: [],
//   }),
// };

// export const COMPONENT_EMPTY_SPACE = {
//   id: 'empty-space',
//   name: t => t('core.components.emptySpace.name', 'Blank space'),
//   type: 'component',
//   render: EmptySpace,
//   icon: 'view_comfy',
//   options: [],
//   settings: EmptySpace.settings,
//   editable: true,
//   construct: () => ({
//     type: 'empty-space',
//     styles: {},
//     settings: {
//       height: '32px',
//       className: '',
//     },
//   }),
// };

export const GROUP_CORE = {
  id: 'core',
  name: t => t('core.groups.core.title', 'Core components'),
  type: 'group',
  components: [
    COMPONENT_ROW,
    // COMPONENT_EMPTY_SPACE,
  ],
};

// export const GROUP_OTHER = {
//   id: 'other',
//   name: t => t('core.groups.other.title', 'Other'),
//   type: 'group',
//   components: [],
// };
