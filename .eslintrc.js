const OFF = 0;
const WARN = 1;

module.exports = {
  extends: ['@poool/eslint-config-react'],
  rules: {
    'react/prop-types': OFF,
    'react/jsx-uses-react': OFF,
    'react/react-in-jsx-scope': OFF,
    'max-len': [WARN, { code: 80, ignorePattern: '^import .*' }],
    'n/no-callback-literal': OFF,
  },
  overrides: [{
    files: ['packages/**/*.test.js', 'packages/**/tests/**/*.js'],
    env: {
      jest: true,
    },
    rules: {
      'import/order': OFF,
    },
  }, {
    files: ['packages/**/*.{ts,tsx}'],
    parser: '@typescript-eslint/parser',
    globals: {
      JSX: 'readonly',
      React: 'readonly',
    },
    rules: {
      // function params are considered as unused vars
      'no-unused-vars': OFF,
      'lines-between-class-members': OFF,
      'no-use-before-define': OFF,
    },
  }, {
    files: ['packages/strapi-plugin/**/*.js'],
    rules: {
      'no-unused-vars': [WARN, { varsIgnorePattern: 'React' }],
    },
  }],
};
