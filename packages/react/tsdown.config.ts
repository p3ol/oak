import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts', './lib/addons.tsx', './lib/options.tsx'],
    outDir: 'dist',
    target: pkg.targets,
    format: ['cjs', 'esm'],
    platform: 'browser',
    external: [
      'react',
      'react-dom',
      '@junipero/core',
      '@junipero/react',
      '@junipero/hooks',
      '@junipero/transitions',
      '@oak/core',
    ],
    sourcemap: true,
    dts: false,
  },
]);
