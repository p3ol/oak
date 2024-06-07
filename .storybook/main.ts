import path from 'node:path';

import type { RuleSetRule } from 'webpack';
import type { StorybookConfig } from '@storybook/react-webpack5';
import { styles } from '@ckeditor/ckeditor5-dev-utils';

const config: StorybookConfig = {
  stories: [
    '../packages/react/lib/index.stories.{js,tsx}',
    '../packages/*/lib/**/*.stories.{js,tsx}',
  ],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-themes',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.sass$/,
            use: [
              'style-loader',
              'css-loader',
              'postcss-loader',
              'sass-loader',
            ],
          },
        ],
      },
    },
    '@storybook/addon-webpack5-compiler-swc',
  ],
  framework: '@storybook/react-webpack5',
  webpackFinal: config => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      '@oakjs/core': path.resolve('./packages/core/lib'),
      '@oakjs/react': path.resolve('./packages/react/lib'),
      '@oakjs/ckeditor5-build-custom': path.resolve('./packages/ckeditor5-build-custom/lib'),
      '@poool/oak/lib': path.resolve('./packages/oak/lib'),
      '@poool/oak': path.resolve('./packages/oak/lib')
    };

    // CKEditor config
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /@ckeditor\/(.+)\.svg$/,
      type: 'asset/source',
    });

    // @ts-ignore webpack is weird bro
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
  swc: config => ({
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
        jsx: true,
      },
    },
  }),
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
