const prefix = 'addons.basicComponents.components.image.settings';

export default {
  title: t => t(prefix + '.title', 'Image options'),
  fields: [{
    type: 'image',
    key: 'url',
    default: [],
    label: t => t(prefix + '.image.title', 'Image'),
  }],
};
