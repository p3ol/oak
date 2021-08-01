export default {
  title: t =>
    t('core.components.emptySpace.settings.title', 'Blank space options'),
  fields: [{
    type: 'text',
    key: 'settings.height',
    default: '32px',
    displayable: true,
    label: t => t('core.components.emptySpace.settings.height', 'Height'),
  }],
};
