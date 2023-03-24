const path = require('path');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

module.exports = {
  stories: [
    '../packages/*/lib/**/*.stories.js',
  ],
  addons: [
    '@storybook/addon-actions/register',
    'storybook-dark-mode',
  ],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: config => {
    config.resolve.alias = {
      '@oakjs/core': path.resolve('./packages/core/lib'),
      '@oakjs/react': path.resolve('./packages/react/lib'),
      '@poool/oak/lib': path.resolve('./packages/oak/lib'),
      '@poool/oak': path.resolve('./packages/oak/lib'),
      // 'react': 'preact/compat',
      // 'react-dom': 'preact/compat',
    };

    config.module.rules.push({
      test: /\.sass$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              sourceMap: true,
              plugins: [
                [tailwindcss, {
                  config: path.resolve('../tailwind.config.js'),
                }],
                autoprefixer
              ],
            },
          },
        },
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            sassOptions: {
              includePaths: [
                path.resolve('./node_modules'),
                path.resolve('./packages/oak/node_modules'),
                path.resolve('./packages/oak/lib/theme'),
                path.resolve(
                  './packages/oak-addon-basic-components/node_modules'
                ),
                path.resolve(
                  './packages/oak-addon-richtext-field/node_modules'
                ),
                path.resolve(
                  './packages/oak-addon-richtext-field-prosemirror/node_modules'
                ),
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};
