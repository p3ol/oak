const fixedSizes = Array.from({ length: 12 }).map((_, i) => ({
  title: t => (i + 1) + ' ' + t('core.components.col.settings.size.value',
    'column(s)'),
  value: i + 1,
})).reverse();

const responsive = [
  {
    title: t => t('core.responsive.default', 'Follow general settings'),
    value: 'default',
  },
  {
    title: t => t('core.responsive.hide', 'Hidden'),
    value: 'hide',
  },
  {
    title: t => t('core.responsive.fluid', 'Flexible'),
    value: 'fluid',
  },
  ...fixedSizes,
];

export default {
  title: t => t('core.components.col.settings.title', 'Col options'),
  popperSettings: {
    placement: 'bottom-end',
    modifiers: [{
      name: 'offset',
      options: {
        offset: [0, 5],
      },
    }],
  },
  fields: [{
    type: 'select',
    key: 'size',
    default: 'fluid',
    label: t => t('core.components.col.settings.size.title', 'Column size'),
    options: [
      {
        title: t => t('core.responsive.fluid', 'Flexible'),
        value: 'fluid',
      },
      ...fixedSizes,
    ],
  }],
  defaults: {
    responsive: false,
  },
  responsive: {
    title: t => t('core.responsive.title', 'Responsive'),
    fields: [{
      key: 'responsive.xl',
      type: 'select',
      default: 'default',
      label: t => t('core.responsive.xl', 'Extra-large screens'),
      options: responsive,
    }, {
      key: 'responsive.lg',
      type: 'select',
      default: 'default',
      label: t => t('core.responsive.lg', 'Large screens (desktop)'),
      options: responsive,
    }, {
      key: 'responsive.md',
      type: 'select',
      default: 'default',
      label: t => t('core.responsive.md', 'Medium screens (tablet)'),
      options: responsive,
    }, {
      key: 'responsive.sm',
      type: 'select',
      default: 'default',
      label: t => t('core.responsive.sm', 'Small screens (phones)'),
      options: responsive,
    }, {
      key: 'responsive.xs',
      type: 'select',
      default: 'default',
      label: t => t('core.responsive.xs', 'Extra-small screens (old phones)'),
      options: responsive,
    }],
  },
};
