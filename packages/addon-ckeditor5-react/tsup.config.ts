import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['./lib/index.ts', './lib/addons.ts'],
    outDir: 'dist',
    banner: {},
    format: ['iife', 'cjs', 'esm'],
    external: [
      'react',
      'react-dom',
      '@oakjs/react',
      'ckeditor5',
      '@ckeditor/ckeditor5-react',
    ],
    sourcemap: true,
  },
]);
