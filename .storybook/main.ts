import { createRequire } from 'node:module';
import path, { dirname, join } from 'node:path';

import type { RuleSetRule } from 'webpack';
import type { StorybookConfig } from '@storybook/react-webpack5';
import type { Config as SWCConfig } from '@swc/core';
import { styles } from '@ckeditor/ckeditor5-dev-utils';

const require = createRequire(import.meta.url);

function getAbsolutePath (value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
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
      '@oakjs/ckeditor5-build-custom': path
        .resolve(__dirname, '../packages/ckeditor5-build-custom/lib'),
      '@poool/oak/lib': path.resolve(__dirname, '../packages/oak/lib'),
      '@poool/oak': path.resolve(__dirname, '../packages/oak/lib'),
    };

    // CKEditor config
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /@ckeditor\/(.+)\.svg$/,
      type: 'asset/source',
    });

    // @ts-expect-error webpack is weird bro
    const cssRule: RuleSetRule = config.module.rules.find((r => (
      r && (r as RuleSetRule).test &&
        (r as RuleSetRule).test?.toString() === '/\\.css$/'
    ))) || ({} as RuleSetRule);
    cssRule.exclude = /@ckeditor/;

    config.module.rules.push({
      test: /@ckeditor\/(.+)\.css$/,
      exclude: /addon-/,
      use: [
        {
          loader: 'style-loader',
          options: {
            injectType: 'singletonStyleTag',
            attributes: {
              'data-cke': true,
            },
          },
        },
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: styles.getPostCssConfig({
              themeImporter: {
                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
              },
              minify: true,
            }),
          },
        },
      ],
    });

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
