import { themes } from '@storybook/theming';

import './index.sass';

export const parameters = {
  darkMode: {
    dark: { ...themes.dark, appBg: '#181818', appContentBg: '#1A1A1A' },
    darkClass: 'dark',
    light: { ...themes.light, appBg: '#FEFEFE', appContentBg: '#FEFEFE' },
    classTarget: 'html',
    stylePreview: true,
  },
};
