const path = require('path');

module.exports = {
  displayName: 'oak',
  testEnvironment: 'jsdom',
  clearMocks: true,
  resetMocks: true,
  rootDir: path.resolve(__dirname),
  moduleNameMapper: {
    '^@tests-utils$': path.resolve(__dirname, 'tests/utils.js'),
    '^react$': 'preact/compat',
    '^react-dom/test-utils$': 'preact/test-utils',
    '^react-dom$': 'preact/compat',
    '^react/jsx-runtime$': 'preact/jsx-runtime',
    '^@testing-library/react$': '@testing-library/preact',
  },
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'tests/',
    '^.+\\.styl$',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.styl$': 'jest-css-modules-transform',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid|preact))',
  ],
  setupFilesAfterEnv: [
    './tests/env.js',
  ],
};
