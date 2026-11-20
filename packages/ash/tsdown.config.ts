import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts', './lib/addons.tsx'],
    outDir: 'dist',
    target: pkg.targets,
    format: ['cjs', 'esm'],
    platform: 'browser',
    deps: {
      neverBundle: [
        'react',
        'react-dom',
        're-resizable',
        '@junipero/core',
        '@junipero/react',
        '@junipero/hooks',
        '@junipero/transitions',
        '@oakjs/core',
        '@oakjs/react-renderer',
      ],
    },
    sourcemap: true,
    dts: false,
    banner: "'use client';",
    inputOptions: {
      platform: 'browser',
    },
  },
]);
