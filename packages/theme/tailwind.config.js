const rootConfig = require('../../tailwind.config.js');

module.exports = {
  ...rootConfig,
  content: [
    '../react/**/*.js',
    '../addon-*/**/*.js',
  ],
};
