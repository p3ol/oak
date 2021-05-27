export default {
  title: 'Title options',
  fields: [{
    type: 'select',
    key: 'headingLevel',
    default: 'h1',
    label: 'Type',
    options: Array.from({ length: 6 }).map((_, i) => ({
      title: `Title ${i + 1} (h${i + 1})`, value: `h${i + 1}`,
    })),
  }, {
    type: 'richtext',
    key: 'content',
    default: '',
    label: 'Content',
  }],
};
