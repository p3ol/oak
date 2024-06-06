const path = require('path');

module.exports = {
  displayName: 'core',
  testEnvironment: 'jsdom',
  clearMocks: true,
  resetMocks: true,
  rootDir: path.resolve(__dirname),
  moduleNameMapper: {
    '^@tests-utils$': path.resolve(__dirname, 'tests/utils.js'),
  },
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
    'tests/',
    '^.+\\.styl$',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid))',
  ],
  setupFilesAfterEnv: [
    path.resolve('.ci/config/env.js'),
  ],
  snapshotResolver: path.resolve('.ci/config/snapshot-resolver.js'),
};
