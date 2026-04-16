import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts', './lib/addons.ts'],
    outDir: 'dist',
    target: pkg.targets,
    format: ['cjs', 'esm'],
    platform: 'browser',
    deps: {
      neverBundle: [
        'react',
        'react-dom',
        '@junipero/react',
        '@junipero/core',
        '@junipero/hooks',
        '@oakjs/react',
        'remirror',
        '@remirror/react',
        '@remirror/pm',
      ],
    },
    sourcemap: true,
    dts: false,
  },
]);
