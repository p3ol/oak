module.exports = {
  presets: [
    ['@babel/env', {
      corejs: 3,
      useBuiltIns: 'usage',
    }],
    ['@babel/react', {
      runtime: 'automatic',
      // importSource: 'preact',
    }],
  ],
  plugins: [
    ['@babel/transform-runtime', {
      corejs: 3,
    }],
  ],
};
