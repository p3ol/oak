import { defineConfig } from 'tsdown';

import svg from '../../.plugins/rolldown-svg.ts';
import pkg from './package.json' with { type: 'json' };

export default defineConfig([
  {
    entry: ['./lib/index.ts', './lib/addons.ts'],
    outDir: 'dist',
    plugins: [
      svg(),
    ],
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
    sourcemap: true,
    dts: false,
  },
]);
