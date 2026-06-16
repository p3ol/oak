import { defineConfig } from 'tsdown';

import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts', './lib/addons.ts'],
    outDir: 'dist',
    format: ['cjs', 'esm'],
    target: pkg.targets,
    platform: 'browser',
    deps: {
      neverBundle: [
        'react',
        'react-dom',
        '@oakjs/react',
        'ckeditor5',
        '@ckeditor/ckeditor5-react',
        '@ckeditor/ckeditor5-icons',
      ],
    },
    loader: {
      '.svg': 'text',
    },
    sourcemap: true,
    dts: false,
  },
]);
