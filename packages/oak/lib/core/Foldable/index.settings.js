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
    key: 'settings.flexDirection',
    default: 'row',
    label: t =>
      t('core.components.foldable.settings.flexDirection.title', 'Direction'),
    options: [{
      title: t => t('core.components.foldable.settings.flexDirection.row',
        'Row (left to right)'),
      value: 'row',
    }, {
      title: t => t(
        'core.components.foldable.settings.flexDirection.rowReverse',
        'Reversed row (right to left)'
      ),
      value: 'row-reverse',
    }, {
      title: t => t('core.components.foldable.settings.flexDirection.column',
        'Column (top to bottom)'),
      value: 'column',
    }, {
      title: t => t(
        'core.components.foldable.settings.flexDirection.columnReverse',
        'Reversed column (bottom to top)'
      ),
      value: 'column-reverse',
    }],
  }, {
    type: 'select',
    key: 'settings.justifyContent',
    default: 'flex-start',
    label: t => t('core.components.foldable.settings.justifyContent.title',
      'Horizontal alignment'),
    options: [{
      title: t => t(
        'core.components.foldable.settings.justifyContent.flexStart',
        'Left'
      ),
      value: 'flex-start',
    }, {
      title: t => t('core.components.foldable.settings.justifyContent.center',
        'Center'),
      value: 'center',
    }, {
      title: t => t('core.components.foldable.settings.justifyContent.flexEnd',
        'Right'),
      value: 'flex-end',
    }, {
      title: t => t(
        'core.components.foldable.settings.justifyContent.spaceBetween',
        'Space between columns'
      ),
      value: 'space-between',
    }, {
      title: t => t(
        'core.components.foldable.settings.justifyContent.spaceAround',
        'Space around columns'
      ),
      value: 'space-around',
    }],
  }, {
    type: 'select',
    key: 'settings.alignItems',
    default: 'flex-start',
    label: t => t('core.components.foldable.settings.alignItems.title',
      'Vertical alignment'),
    options: [{
      title: t => t('core.components.foldable.settings.alignItems.flexStart',
        'Top'),
      value: 'flex-start',
    }, {
      title: t => t('core.components.foldable.settings.alignItems.center',
        'Center'),
      value: 'center',
    }, {
      title: t => t('core.components.foldable.settings.alignItems.flexEnd',
        'Bottom'),
      value: 'flex-end',
    }, {
      title: t => t('core.components.foldable.settings.alignItems.stretch',
        'Stretch'),
      value: 'stretch',
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
