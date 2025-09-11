import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts', './lib/addons.ts'],
    outDir: 'dist',
    target: pkg.targets,
    format: ['cjs', 'esm'],
    platform: 'neutral',
    external: [
      '@junipero/core',
    ],
    sourcemap: true,
    dts: false,
  },
]);
