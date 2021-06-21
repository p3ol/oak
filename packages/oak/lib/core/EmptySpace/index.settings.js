export default {
  title: t =>
    t('core.components.emptySpace.settings.title', 'Empty space options'),
  fields: [{
    type: 'text',
    key: 'settings.height',
    default: '32px',
    label: t => t('core.components.emptySpace.settings.height', 'Height'),
  }],
};
