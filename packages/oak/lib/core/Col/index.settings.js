export default {
  title: 'Col options',
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
    label: 'Column size',
    options: [
      { title: 'Fluid', value: 'fluid' },
      ...Array.from({ length: 12 }).map((_, i) => ({
        title: `${i + 1} column(s)`,
        value: i + 1,
      })).reverse(),
    ],
  }],
  defaults: {
    responsive: false,
  },
  responsive: {
    title: 'Responsive',
    fields: [{
      key: 'responsive.xl',
      type: 'select',
      label: 'Extra-large screens',
      default: 'fluid',
      options: [
        { title: 'Fluid size', value: 'fluid' },
        ...Array.from({ length: 12 }).map((_, i) => ({
          title: `${i + 1} column(s)`,
          value: i + 1,
        })).reverse(),
        { title: 'Hidden', value: 'hide' },
      ],
    }, {
      key: 'responsive.lg',
      type: 'select',
      label: 'Large screens (desktop)',
      default: 'fluid',
      options: [
        { title: 'Fluid size', value: 'fluid' },
        ...Array.from({ length: 12 }).map((_, i) => ({
          title: `${i + 1} column(s)`,
          value: i + 1,
        })).reverse(),
        { title: 'Hidden', value: 'hide' },
      ],
    }, {
      key: 'responsive.md',
      type: 'select',
      label: 'Medium screens (tablet)',
      default: 'fluid',
      options: [
        { title: 'Fluid size', value: 'fluid' },
        ...Array.from({ length: 12 }).map((_, i) => ({
          title: `${i + 1} column(s)`,
          value: i + 1,
        })).reverse(),
        { title: 'Hidden', value: 'hide' },
      ],
    }, {
      key: 'responsive.sm',
      type: 'select',
      label: 'Small screens (phones)',
      default: 'fluid',
      options: [
        { title: 'Fluid size', value: 'fluid' },
        ...Array.from({ length: 12 }).map((_, i) => ({
          title: `${i + 1} column(s)`,
          value: i + 1,
        })).reverse(),
        { title: 'Hidden', value: 'hide' },
      ],
    }, {
      key: 'responsive.xs',
      type: 'select',
      label: 'Extra-small screens (old phones)',
      default: 'fluid',
      options: [
        { title: 'Fluid size', value: 'fluid' },
        ...Array.from({ length: 12 }).map((_, i) => ({
          title: `${i + 1} column(s)`,
          value: i + 1,
        })).reverse(),
        { title: 'Hidden', value: 'hide' },
      ],
    }],
  },
};
