import { defineConfig, globalIgnores } from 'eslint/config';
import storybook from 'eslint-plugin-storybook';
import pooolint from '@poool/eslint-config-react';
import globals from 'globals';

export default defineConfig(
  globalIgnores([
    'dist',
    '**/dist',
    'coverage',
    '.yarn',
    'node_modules',
    'storybook-static',
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        globalThis: 'readonly',
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  pooolint.configs.recommended,
  {
    rules: {
      'new-cap': ['warn', {
        properties: false,
      }],
    },
  },
  storybook.configs['flat/recommended'],
  // {
  //   files: ['**/strapi-plugin/**'],
  //   rules: {
  //     'react/jsx-uses-react': 1,
  //     'react/prop-types': 0,
  //   },
  // }
);
