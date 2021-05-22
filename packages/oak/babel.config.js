module.exports = {
  presets: [
    ['@babel/env', {
      corejs: 3,
      useBuiltIns: 'usage',
    }],
    ['@babel/react', {
      runtime: 'automatic',
    }],
  ],
  plugins: [
    ['@babel/transform-runtime', {
      corejs: 3,
    }],
    '@babel/proposal-private-methods',
    '@babel/proposal-class-properties',
  ],
};
