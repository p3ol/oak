const path = require('path');

module.exports = {
  displayName: 'react',
  testEnvironment: 'jsdom',
  clearMocks: true,
  resetMocks: true,
  rootDir: path.resolve(__dirname),
  moduleNameMapper: {
    '^@oakjs/core$': path.resolve('./packages/core/lib'),
    '^@oakjs/core(.+)$': path.resolve('./packages/core/lib$1'),
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
    path.resolve('./.ci/config/env.js'),
  ],
  snapshotResolver: path.resolve('.ci/config/snapshot-resolver.js'),
};
