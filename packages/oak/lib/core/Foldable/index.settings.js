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
  }],
};
