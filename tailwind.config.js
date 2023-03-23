const junipero = require('@junipero/tailwind-plugin');
const plugin = require('tailwindcss/plugin');

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
    plugin(({ addUtilities }) => {
      addUtilities({
        '.items-flex-start': {
          'align-items': 'flex-start',
        },
        '.items-flex-end': {
          'align-items': 'flex-end',
        },
      });
    }),
  ],
};
