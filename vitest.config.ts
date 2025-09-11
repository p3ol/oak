import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts?(x)'],
    environment: 'jsdom',
    globals: true,
    env: {
      TZ: 'UTC',
    },
    resolveSnapshotPath: (testPath: string, snapExtension: string) =>
      testPath + snapExtension,
    coverage: {
      provider: 'v8',
      exclude: [
        'storybook-static',
        '.turbo',
        '.storybook',
        '.yarn',
        '*.d.ts',
        '*.config.ts',
        '*.config.js',
        '**/dist',
        '**/test?(s)',
        '**/script?(s)',
        '**/.turbo',
        '**/*.d.ts',
        '**/*.stories.tsx',
        '**/*.config.ts',
        '**/*.config.js',
      ],
    },
    setupFiles: ['./tests/setup.ts'],
    alias: {
      '@oak/core': path.resolve('./packages/core/lib'),
      '@oak/react': path.resolve('./packages/react/lib'),
    },
  },
});
