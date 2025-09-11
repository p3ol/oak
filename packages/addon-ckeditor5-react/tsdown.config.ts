import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts', './lib/addons.ts'],
    outDir: 'dist',
    format: ['cjs', 'esm'],
    target: pkg.targets,
    platform: 'browser',
    external: [
      'react',
      'react-dom',
      '@oakjs/react',
      'ckeditor5',
      '@ckeditor/ckeditor5-react',
    ],
    loader: {
      '.svg': 'text',
    },
    sourcemap: true,
    dts: false,
  },
]);
