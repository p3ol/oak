import type { Config } from 'tailwindcss/types/config';

import rootConfig from '../../tailwind.config';

const config: Config = {
  ...rootConfig,
  content: [
    '../react/**/*.{js,ts,tsx}',
    '../addon-*/**/*.{js,ts,tsx}',
  ],
};

export default config;
