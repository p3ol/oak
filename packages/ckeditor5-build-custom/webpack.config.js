const path = require('path');

const webpack = require('webpack');
const { bundler, styles } = require('@ckeditor/ckeditor5-dev-utils');
const {
  CKEditorTranslationsPlugin,
} = require('@ckeditor/ckeditor5-dev-translations');
const TerserWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  performance: { hints: false },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  target: 'web',
  entry: path.resolve(__dirname, 'lib', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ckeditor.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'ClassicEditor',
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'react-dom/client': 'react-dom/client',
    '@oakjs/react': '@oakjs/react',
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          output: { comments: /^!/ },
        },
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new CKEditorTranslationsPlugin({
      language: 'en',
      additionalLanguages: 'all',
    }),
    new webpack.BannerPlugin({
      banner: bundler.getLicenseBanner(),
      raw: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.[jt]sx?/,
        exclude: /node_modules/,
        use: ['swc-loader'],
      },
      {
        test: /\.svg$/,
        use: ['raw-loader'],
      },
      {
        test: /\.css$/,
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
      },
    ],
  },
};
