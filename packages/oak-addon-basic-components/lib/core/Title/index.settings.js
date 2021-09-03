const prefix = 'addons.basicComponents.components.title.settings';

export default {
  title: t => t(prefix + '.title', 'Title settings'),
  fields: [{
    type: 'select',
    key: 'headingLevel',
    default: 'h1',
    displayable: true,
    label: t => t(prefix + '.type.title', 'Type'),
    options: Array.from({ length: 6 }).map((_, i) => ({
      title: t => t(prefix + '.type.value', 'Title') +
        ` ${i + 1} (h${i + 1})`,
      value: `h${i + 1}`,
    })),
  }, {
    type: 'textarea',
    key: 'content',
    default: '',
    label: t => t(prefix + '.content.title', 'Content'),
  }],
};
