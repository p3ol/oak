const junipero = require('@junipero/tailwind-plugin');

module.exports = {
  prefix: 'oak-',
  content: [
    './packages/react/**/*.js',
  ],
  safelist: [
    { pattern: /flex-/ },
    { pattern: /basis-(.+)\/12/ },
  ],
  plugins: [
    junipero,
  ],
};
