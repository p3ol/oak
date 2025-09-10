import { createRequire } from 'node:module';
import path from 'node:path';

import type { StorybookConfig } from '@storybook/react-webpack5';
import type { Config as SWCConfig } from '@swc/core';

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
    {
      name: getAbsolutePath('@storybook/addon-styling-webpack'),
      options: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      'autoprefixer',
                      'tailwindcss',
                    ],
                  },
                },
              },
            ],
          },
          {
            test: /\.sass$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      'autoprefixer',
                      'tailwindcss',
                    ],
                  },
                },
              },
              'sass-loader',
            ],
          },
          {
            test: /@ckeditor\/(.+)\.svg$/,
            type: 'asset/source',
          },
        ],
      },
    },
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  framework: getAbsolutePath('@storybook/react-webpack5'),
  webpackFinal: config => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      '@oakjs/core': path.resolve(__dirname, '../packages/core/lib'),
      '@oakjs/react': path.resolve(__dirname, '../packages/react/lib'),
    };

    return config;
  },
  swc: (config: SWCConfig) => ({
    ...config,
    jsc: {
      ...config.jsc,
      transform: {
        ...config.jsc?.transform,
        react: {
          ...config.jsc?.transform?.react,
          runtime: 'automatic',
        },
      },
      parser: {
        ...config.jsc?.parser,
        syntax: 'typescript',
        tsx: true,
      },
    },
  }),
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
