const OFF = 0;

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
    },
  }],
};
