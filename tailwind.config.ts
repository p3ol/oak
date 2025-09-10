import type { Config } from 'tailwindcss/types/config';
import { fromPairs } from '@junipero/core';
import junipero from '@junipero/tailwind-plugin';
import plugin from 'tailwindcss/plugin';

const config: Config = {
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
    './packages/react/**/*.{js,ts,tsx}',
    './packages/addon-*/**/*.{js,ts,tsx}',
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
    plugin(({ addUtilities, theme, e }) => {
      // Handle old flexbox utilities
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
        '.flex-column': {
          'flex-direction': 'column',
        },
        '.flex-column-reverse': {
          'flex-direction': 'column-reverse',
        },
      });

      // Set gap as a variable to be used in flex basis calculation
      addUtilities({
        ...fromPairs(Object.entries(theme('gap')).map(([k, v]) => [
          `.gap-${k}`,
          {
            '--tw-gap': v,
            gap: v,
          },
        ])),
      }, theme('gap'));

      // And overwrite flex basis minus the gap
      addUtilities({
        ...fromPairs(Object.entries(theme('flexBasis')).map(([k, v]) => [
          `.basis-${e(k)}`,
          {
            'flex-basis': k.endsWith('/12')
              ? `calc(${v} - (var(--tw-gap) - (var(--tw-gap) * (${k}))))`
              : `calc(${v} - (var(--tw-gap) / 2))`,
          },
        ])),
      }, theme('flexBasis'));
    }),
  ],
};

export default config;
