const path = require('path');

module.exports = {
  displayName: '@oakjs/react',
  testEnvironment: 'jsdom',
  clearMocks: true,
  resetMocks: true,
  rootDir: path.resolve(__dirname),
  moduleNameMapper: {
    '^@oakjs/core(.+)$': '<rootDir>/../core/lib$1',
    '^@tests-utils$': path.resolve(__dirname, 'tests/utils.js'),
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
    '/node_modules/(?!(uuid))',
  ],
  setupFilesAfterEnv: [
    './tests/env.js',
  ],
  snapshotResolver: path.resolve('.ci/config/snapshot-resolver.js'),
};
