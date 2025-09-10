import path from 'node:path';

import type { Config } from 'jest';

const config: Config = {
  displayName: 'core',
  testEnvironment: 'jsdom',
  clearMocks: true,
  resetMocks: true,
  rootDir: path.resolve(__dirname),
  coveragePathIgnorePatterns: [
    'node_modules',
    'dist',
  ],
  transform: {
    '^.+\\.m?(t|j)sx?$': ['@swc/jest', {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid))',
  ],
  setupFilesAfterEnv: [
    path.resolve('.ci/config/env.ts'),
  ],
  snapshotResolver: path.resolve('.ci/config/snapshot-resolver.ts'),
};

export default config;
