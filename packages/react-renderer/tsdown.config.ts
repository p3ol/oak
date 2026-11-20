import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts'],
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
    inputOptions: {
      platform: 'neutral',
    },
  },
]);
