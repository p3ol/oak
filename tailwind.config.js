const junipero = require('@junipero/tailwind-plugin');
const plugin = require('tailwindcss/plugin');

module.exports = {
  prefix: 'oak-',
  theme: {
    colors: {
      'main-color': 'var(--oak-main-color)',
      'darker-main-color': 'var(--oak-darker-main-color)',
      'lighter-main-color': 'var(--oak-lighter-main-color)',
      'background-main-color': 'var(--oak-background-main-color)',
      'shadow-color': 'var(--oak-shadow-color)',
      'background-color': 'var(--oak-background-color)',
      'inner-background-color': 'var(--oak-inner-background-color)',
      'foreground-color': 'var(--oak-foreground-color)',
      'interaction-color': 'var(--oak-interaction-color)',
      'text-color': 'var(--oak-text-color)',
      'reverse-text-color': 'var(--oak-reverse-text-color)',
      'alternate-text-color': 'var(--oak-alternate-text-color)',
      'floating-background-color': 'var(--oak-floating-background-color)',
      'error-color': 'var(--oak-error-color)',
      'field-border-color': 'var(--oak-field-border-color)',
      'tooltip-border-color': 'var(--oak-tooltip-border-color)',
    },
  },
  content: [
    './packages/react/**/*.js',
    './packages/addon-*/**/*.js',
  ],
  safelist: [
    { pattern: /flex-/ },
    { pattern: /basis-(.+)\/12/ },
    { pattern: /basis-full/ },
    { pattern: /items-/ },
    { pattern: /justify-/ },
  ],
  plugins: [
    junipero,
    plugin(({ addUtilities }) => {
      addUtilities({
        '.justify-space-around': {
          'justify-content': 'space-around',
        },
        '.justify-space-between': {
          'justify-content': 'space-between',
        },
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
