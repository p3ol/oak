const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = ({ config }) => {
  config.resolve.modules = ['node_modules', path.resolve('./node_modules')];
  config.resolve.alias = {
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
          sourceMap: true,
          plugins: loader => ([autoprefixer]),
        },
      },
      'stylus-loader',
    ],
  });

  return config;
};
