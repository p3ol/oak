export default {
  title: 'Col options',
  popperSettings: {
    placement: 'bottom-end',
    strategy: 'fixed',
    positionFixed: true,
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
};
