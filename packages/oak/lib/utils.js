export const filterOverride = (type, o, item) => {
  switch (type) {
    case 'component':
      return o.components.includes(item);
    case 'field':
      return o.fields.includes(item);
    default:
      return false;
  }
};
