import { DEFAULT_STYLES_SETTINGS } from '../../defaults';

export default {
  title: 'Row options',
  popperSettings: {
    placement: 'right-start',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 5],
      },
    }],
  },
  fields: [{
    type: 'select',
    key: 'settings.flexDirection',
    default: 'row',
    label: 'Direction',
    options: [
      { title: 'Row (left to right)', value: 'row' },
      { title: 'Reversed row (right to left)', value: 'row-reverse' },
      { title: 'Column (top to bottom)', value: 'column' },
      { title: 'Column reversed (bottom to top)', value: 'column-reverse' },
    ],
  }, {
    type: 'select',
    key: 'settings.justifyContent',
    default: 'flex-start',
    label: 'Horizontal alignment',
    options: [
      { title: 'Left', value: 'flex-start' },
      { title: 'Center', value: 'center' },
      { title: 'Right', value: 'flex-end' },
      { title: 'Spaced between', value: 'space-between' },
      { title: 'With space around', value: 'space-between' },
    ],
  }, {
    type: 'select',
    key: 'settings.alignItems',
    default: 'flex-start',
    label: 'Vertical alignment',
    options: [
      { title: 'Top', value: 'flex-start' },
      { title: 'Center', value: 'center' },
      { title: 'Bottom', value: 'flex-end' },
    ],
  }, {
    type: 'select',
    key: 'settings.gutters',
    default: true,
    label: 'Column gutters',
    options: [
      { title: 'Enabled', value: true },
      { title: 'Disabled', value: false },
    ],
  }],
  styling: {
    ...DEFAULT_STYLES_SETTINGS,
  },
};
