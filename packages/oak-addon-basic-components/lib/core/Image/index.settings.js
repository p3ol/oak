const prefix = 'addons.basicComponents.components.image.settings';

export default {
  title: t => t(prefix + '.title', 'Image options'),
  fields: [{
    type: 'image',
    key: 'url',
    default: [],
    label: t => t(prefix + '.image.title', 'Image'),
  }, {
    type: 'select',
    key: 'settings.size',
    label: t => t(prefix + '.image.size.title', 'Image size'),
    default: 'auto',
    options: [{
      title: t => t(prefix + '.image.size.auto', 'Adapted to content'),
      value: 'auto',
    }, {
      title: t => t(prefix + '.image.size.full', 'Real size'),
      value: 'full',
    }, {
      title: t => t(prefix + '.image.size.custom', 'Personalized'),
      value: 'custom',
    }],
  }, {
    condition: e => e?.settings?.size === 'custom',
    type: 'text',
    key: 'settings.width',
    label: t => t(prefix + '.image.size.width', 'Image width'),
    placeholder: t => t(prefix + '.image.size.width', 'Image width'),
  }, {
    condition: e => e?.settings?.size === 'custom',
    type: 'text',
    key: 'settings.height',
    label: t => t(prefix + '.image.size.height', 'Image height'),
    placeholder: t => t(prefix + '.image.size.height', 'Image height'),
  }],
};
