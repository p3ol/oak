export default {
  title: 'Title options',
  fields: [{
    type: 'richtext',
    key: 'content',
    default: '',
    label: 'Content',
  }, {
    type: 'select',
    key: 'action',
    default: 'link',
    label: 'Action',
    options: [
      { title: 'Open link', value: 'link' },
      { title: 'Fire event', value: 'event' },
    ],
  }, {
    type: 'text',
    key: 'url',
    default: '',
    label: 'Link url',
    condition: element => element.action === 'link',
  }, {
    type: 'text',
    key: 'event',
    default: '',
    label: 'Event name',
    condition: element => element.action === 'event',
  }, {
    type: 'select',
    key: 'settings.buttonType',
    default: 'button',
    label: 'Type',
    options: [
      { title: 'Button', value: 'button' },
      { title: 'Link', value: 'link' },
    ],
  }],
};
