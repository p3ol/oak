import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['./lib/index.ts', './lib/addons.ts'],
    outDir: 'dist',
    banner: {},
    format: ['iife', 'cjs', 'esm'],
    external: [
      '@junipero/core',
    ],
    sourcemap: true,
  },
]);
