import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: {
      index: './lib/index.ts',
      addons: './lib/addons.tsx',
      // Only loaded by consumers using collaboration
      yjs: './lib/yjs/index.ts',
    },
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
        'yjs',
        'y-protocols',
        /^y-protocols\//,
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
