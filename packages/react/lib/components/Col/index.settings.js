const fixedSizes = Array.from({ length: 12 }).map((_, i) => ({
  title: t => (i + 1) + ' ' + t('core.components.col.settings.size.value',
    'column(s)'),
  value: i + 1,
})).reverse();

const responsive = [
  {
    title: t => t('core.responsive.fluid', 'Flexible'),
    value: 'fluid',
  },
  {
    title: t => t('core.responsive.auto', 'Adapted to content'),
    value: 'auto',
  },
  ...fixedSizes,
  {
    title: t => t('core.responsive.hide', 'Hidden'),
    value: 'hide',
  },
];

export default {
  title: t => t('core.components.col.settings.title', 'Col options'),
  floatingSettings: {
    placement: 'bottom-end',
    autoPlacement: {
      alignment: 'end',
      allowedPlacements: ['bottom-end', 'top-end'],
    },
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
      {
        title: t => t('core.responsive.auto', 'Adapted to content'),
        value: 'auto',
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
      label: t => t('core.responsive.xl', 'Extra-large screens'),
      default: 'fluid',
      options: responsive,
    }, {
      key: 'responsive.lg',
      type: 'select',
      label: t => t('core.responsive.lg', 'Large screens (desktop)'),
      default: 'fluid',
      options: responsive,
    }, {
      key: 'responsive.md',
      type: 'select',
      label: t => t('core.responsive.md', 'Medium screens (tablet)'),
      default: 'fluid',
      options: responsive,
    }, {
      key: 'responsive.sm',
      type: 'select',
      label: t => t('core.responsive.sm', 'Small screens (phones)'),
      default: 'fluid',
      options: responsive,
    }, {
      key: 'responsive.xs',
      type: 'select',
      label: t => t('core.responsive.xs', 'Extra-small screens (old phones)'),
      default: 'fluid',
      options: responsive,
    }],
  },
};
