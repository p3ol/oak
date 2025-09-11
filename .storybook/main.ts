import { createRequire } from 'node:module';
import path from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

import viteSvg from '../.plugins/vite-svg';

const require = createRequire(import.meta.url);

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
          '@oakjs/react': path.resolve(__dirname, '../packages/react/lib'),
        },
      },
      plugins: [
        viteSvg(),
      ],
    });
  },
};

export default config;
