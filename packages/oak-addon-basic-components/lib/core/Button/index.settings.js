const prefix = 'addons.basicComponents.components.button.settings';

export default {
  title: t => t(prefix + '.title', 'Button options'),
  fields: [{
    type: 'richtext',
    key: 'content',
    default: '',
    label: t => t(prefix + '.content.title', 'Content'),
  }, {
    type: 'select',
    key: 'action',
    default: 'link',
    displayable: true,
    label: t => t(prefix + '.action.title', 'Action'),
    options: [{
      title: t => t(prefix + '.action.openLink', 'Open link'),
      value: 'link',
    }, {
      title: t => t(prefix + '.action.fireEvent', 'Fire event'),
      value: 'event',
    }],
  }, {
    type: 'text',
    key: 'url',
    default: '',
    displayable: true,
    label: t => t(prefix + '.url.title', 'Link url'),
    condition: element => element.action === 'link',
  }, {
    type: 'text',
    key: 'event',
    default: '',
    displayable: true,
    label: t => t(prefix + '.event.title', 'Event name'),
    condition: element => element.action === 'event',
  }, {
    type: 'select',
    key: 'settings.buttonType',
    default: 'button',
    label: t => t(prefix + '.type.title', 'Type'),
    options: [{
      title: t => t(prefix + '.type.button', 'Button'),
      value: 'button',
    }, {
      title: t => t(prefix + '.type.link', 'Link'),
      value: 'link',
    }],
  }],
};
