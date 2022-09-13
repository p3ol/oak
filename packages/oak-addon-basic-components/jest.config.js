const path = require('path');

module.exports = {
  displayName: {
    name: 'oak addon basic components',
    color: 'blue',
  },
  testEnvironment: 'jsdom',
  clearMocks: true,
  resetMocks: true,
  rootDir: path.resolve(__dirname),
  moduleNameMapper: {
    '^@mocks(.+)$': path.resolve(__dirname, 'tests/__mocks__') + '$1',
    '^@poool/oak$': path.resolve(__dirname, '../oak/lib/index.js'),
    '^react$': 'preact/compat',
    '^react-dom/test-utils$': 'preact/test-utils',
    '^react-dom$': 'preact/compat',
    '^react/jsx-runtime$': 'preact/jsx-runtime',
    '^@testing-library/react$': '@testing-library/preact',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.styl$': 'jest-css-modules-transform',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|preact))',
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'tests/',
    '^.+\\.styl$',
  ],
};
