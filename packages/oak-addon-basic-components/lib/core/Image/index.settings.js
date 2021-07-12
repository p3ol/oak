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
    key: 'size',
    label: 'taille de l\'image',
    default: 'full',
    options: [{
      title: 'adapté au contenu',
      value: 'auto',
    }, {
      title: 'Taille réelle',
      value: 'full',
    }, {
      title: 'Personnalisé',
      value: 'custom',
    }],
  }, {
    condition: e => e?.size === 'custom',
    type: 'text',
    key: 'width',
    label: 'Largeur de l\'image',
    default: '100',
  }, {
    condition: e => e?.size === 'custom',
    type: 'text',
    key: 'height',
    label: 'hauteur de l\'image',
    default: '100',
  }],
};
