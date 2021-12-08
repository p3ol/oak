const prefix = 'addons.basicComponents.components.button.settings';

export default {
  title: t => t(prefix + '.title', 'Button options'),
  fields: [{
    type: 'textarea',
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
      title: t => t(prefix + '.action.openLink', 'Open a link'),
      value: 'link',
    }, {
      title: t => t(prefix + '.action.fireEvent', 'Trigger an event'),
      value: 'event',
    }],
  }, {
    type: 'text',
    key: 'url',
    default: '',
    displayable: true,
    label: t => t(prefix + '.url.title', 'URL link'),
    condition: element => element.action === 'link',
  }, {
    type: 'text',
    key: 'event',
    default: '',
    displayable: true,
    label: t => t(prefix + '.event.title', 'Javascript event name'),
    condition: element => element.action === 'event',
  }, {
    type: 'select',
    key: 'settings.buttonType',
    default: 'button',
    label: t => t(prefix + '.type.title', 'HTML element type'),
    options: [{
      title: t => t(prefix + '.type.button', 'Button'),
      value: 'button',
    }, {
      title: t => t(prefix + '.type.links', 'Link'),
      value: 'link',
    }],
  }, {
    type: 'text',
    key: 'key',
    default: '',
    label: t => t(prefix + '.key.title', 'Button id'),
    placeholder: t => t(prefix + '.key.placeholder', 'Ex: my-button'),
  }],
};
