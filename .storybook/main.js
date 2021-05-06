module.exports = {
  stories: ['../packages/**/*.stories.js'],
  addons: [
    '@storybook/addon-storysource',
  ],
  core: {
    builder: 'webpack5',
  }
};
