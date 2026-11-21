import { type UserConfig, defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

const common: UserConfig = {
  outDir: 'dist',
  target: pkg.targets,
  format: ['cjs', 'esm'],
  platform: 'neutral',
  deps: {
    neverBundle: [
      'react',
      'react-dom',
      '@junipero/core',
    ],
  },
  sourcemap: true,
  dts: false,
  // Both configs output to the same directory
  clean: false,
  inputOptions: {
    platform: 'neutral',
  },
};

export default defineConfig([
  {
    ...common,
    // Every renderer, including interactive ones (state, effects, event
    // handlers): marked as client code for React Server Components
    entry: { index: './lib/index.ts' },
    banner: { js: '\'use client\';' },
  },
  {
    ...common,
    // Server-capable renderers & helpers, without the 'use client' directive.
    // Built separately so that no chunk is shared with the client entry.
    entry: { server: './lib/server.ts' },
  },
]);
