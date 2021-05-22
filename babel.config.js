// Only used by eslint
module.exports = {
  presets: [
    '@babel/env',
    ['@babel/react', {
      runtime: 'automatic',
    }],
  ],
  plugins: [
    '@babel/proposal-private-methods',
    '@babel/proposal-class-properties',
  ],
};
