export default {
  title: t => t('core.components.foldable.settings.title', 'Foldable options'),
  popperSettings: {
    placement: 'right-start',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 5],
      },
    }],
  },
  fields: [{
    type: 'select',
    key: 'settings.seeMorePosition',
    default: 'after',
    label: t => t('core.components.foldable.settings.seeMorePosition.title',
      'See more placement'
    ),
    options: [{
      title: t => t('core.components.foldable.settings.seeMorePosition.before',
        'Before'
      ),
      value: 'before',
    }, {
      title: t => t('core.components.foldable.settings.seeMorePosition.after',
        'After'
      ),
      value: 'after',
    }],
  }, {
    type: 'select',
    key: 'settings.gutters',
    default: true,
    label: t => t('core.components.foldable.settings.gutters.title',
      'Column gap'),
    options: [{
      title: t => t('core.components.foldable.settings.gutters.enabled',
        'Enabled'),
      value: true,
    }, {
      title: t => t('core.components.foldable.settings.gutters.disabled',
        'Disabled'),
      value: false,
    }],
  }],
};
