const path = require('path');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const { bundler, styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
  stories: [
    '../packages/react/lib/index.stories.js',
    '../packages/*/lib/**/*.stories.js',
  ],
  addons: ['@storybook/addon-actions', 'storybook-dark-mode'],
  webpackFinal: config => {
    config.resolve.alias = {
      '@oakjs/core': path.resolve('./packages/core/lib'),
      '@oakjs/react': path.resolve('./packages/react/lib'),
      '@oakjs/ckeditor5-build-custom': path.resolve('./packages/ckeditor5-build-custom/lib'),
      '@poool/oak/lib': path.resolve('./packages/oak/lib'),
      '@poool/oak': path.resolve('./packages/oak/lib')
    };

    config.module.rules.push({
      test: /\.sass$/,
      use: ['style-loader', 'css-loader', {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            sourceMap: true,
            plugins: [
              [tailwindcss, {
                config: path.resolve('../tailwind.config.js')
              }],
              autoprefixer,
            ],
          },
        },
      }, 'resolve-url-loader', {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          sassOptions: {
            includePaths: [
              path.resolve('./node_modules'),
              path.resolve('./packages/oak/node_modules'),
              path.resolve('./packages/oak/lib/theme'),
              path.resolve('./packages/oak-addon-basic-components/node_modules'),
              path.resolve('./packages/oak-addon-richtext-field/node_modules'),
              path.resolve('./packages/oak-addon-richtext-field-prosemirror/node_modules')
            ],
          },
        },
      }],
    });

    // CKEditor config
    config.module.rules.push({
      test: /@ckeditor\/(.+)\.svg$/,
      type: 'asset/source',
    });

    const cssRule = config.module.rules
      .find(r => r.test.toString() === '/\\.css$/');
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
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  }
};
