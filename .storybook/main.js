const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  stories: [
    '../packages/*/lib/**/*.stories.js',
  ],
  addons: [
    '@storybook/addon-actions/register',
  ],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: config => {
    config.resolve.alias = {
      '@poool/oak/lib': path.resolve('./packages/oak/lib'),
      '@poool/oak': path.resolve('./packages/oak/lib'),
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
    };

    config.module.rules.push({
      test: /\.styl$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              sourceMap: true,
              plugins: [autoprefixer],
            },
          },
        },
        'stylus-loader',
      ],
    });

    return config;
  },
};
