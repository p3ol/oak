module.exports = {
  presets: [
    ['@babel/env', {
      corejs: 3,
      useBuiltIns: 'usage',
    }],
  ],
  plugins: [
    ['@babel/transform-runtime', {
      corejs: 3,
    }],
  ],
};
