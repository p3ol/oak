import type { Config } from 'tailwindcss/types/config';

import rootConfig from '../../tailwind.config';

const config: Config = {
  ...rootConfig,
  content: [
    '../react/**/*.js',
    '../addon-*/**/*.js',
  ],
};

export default config;
