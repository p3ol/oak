const junipero = require('@junipero/tailwind-plugin');

module.exports = {
  prefix: 'oak-',
  content: [
    './packages/react/**/*.js',
  ],
  plugins: [
    junipero,
  ],
};
