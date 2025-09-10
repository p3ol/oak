import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['./lib/index.ts', './lib/addons.tsx', './lib/options.tsx'],
    outDir: 'dist',
    banner: {},
    format: ['iife', 'cjs', 'esm'],
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
  },
]);
