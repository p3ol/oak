module.exports = {
  presets: [
    ['@babel/preset-env', {
      corejs: 3,
      useBuiltIns: 'usage',
    }],
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
    }],
  ],
};
