import { createRequire } from 'node:module';
import path from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

import viteSvg from '../.plugins/vite-svg.ts';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

function getAbsolutePath (value: string): any {
  return path.dirname(require.resolve(path.join(value, 'package.json')));
}

const config: StorybookConfig = {
  stories: [
    '../packages/*/lib/**/*.stories.{js,tsx}',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-themes'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  viteFinal: async config => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '~': path.resolve(__dirname, '../'),
          '@oakjs/core': path.resolve(__dirname, '../packages/core/lib'),
          '@oakjs/react-renderer': path.resolve(
            __dirname, '../packages/react-renderer/lib'
          ),
          '@oakjs/react': path.resolve(__dirname, '../packages/react/lib'),
          '@oakjs/ash': path.resolve(__dirname, '../packages/ash/lib'),
          '@oakjs/addon-ckeditor5-react': path.resolve(
            __dirname, '../packages/addon-ckeditor5-react/lib'
          ),
          '@oakjs/addon-remirror': path.resolve(
            __dirname, '../packages/addon-remirror/lib'
          ),
        },
      },
      plugins: [
        viteSvg(),
      ],
    });
  },
};

export default config;
