const path = require('path');

module.exports = {
  displayName: 'oak',
  testEnvironment: 'jsdom',
  clearMocks: true,
  resetMocks: true,
  rootDir: path.resolve(__dirname),
  moduleNameMapper: {
    '^@tests-utils$': path.resolve(__dirname, 'tests/utils.js'),
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.styl$': 'jest-css-modules-transform',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid))',
  ],
  setupFilesAfterEnv: [
    './tests/env.js',
  ],
};
