export default {
  title: t =>
    t('core.components.emptySpace.settings.title', 'Blank space settings'),
  fields: [{
    type: 'text',
    key: 'settings.height',
    default: '32px',
    displayable: true,
    label: t => t('core.components.emptySpace.settings.height', 'Height'),
  }],
};
