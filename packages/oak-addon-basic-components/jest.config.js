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
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.styl$': 'jest-css-modules-transform',
  },
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'tests/',
    '^.+\\.styl$',
  ],
};
