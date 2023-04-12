module.exports = {
  register: ({ strapi }) => {
    strapi.customFields.register({
      name: 'oak',
      plugin: 'oak',
      type: 'text',
    });
  },
};
