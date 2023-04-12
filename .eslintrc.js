const OFF = 0;
const WARN = 1;

module.exports = {
  extends: ['@poool/eslint-config-react'],
  rules: {
    'react/prop-types': 0,
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
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
      'no-unused-vars': 0,
      'lines-between-class-members': 0,
      'no-use-before-define': 0,
    },
  }, {
    files: ['packages/strapi-plugin/**/*.js'],
    rules: {
      'no-unused-vars': [WARN, { varsIgnorePattern: 'React' }],
      'max-len': [WARN, { code: 80, ignorePattern: '^import .*' }],
    },
  }],
};
