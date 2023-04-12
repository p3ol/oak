import { action } from '@storybook/addon-actions';
import { Builder, baseAddon } from '@oakjs/react';

import { ckeditorFieldAddon } from './addons';

export default { title: 'React/With addon: CKEditor' };

const baseContent = [
  { type: 'text', content: 'This is a title' },
];

const addon = {
  overrides: [{
    type: 'component',
    targets: ['text', 'title', 'button'],
    fields: [{
      key: 'content',
      type: 'ckeditor',
    }],
  }],
};

export const basic = () => (
  <Builder
    addons={[baseAddon(), ckeditorFieldAddon(), addon]}
    value={baseContent}
    rootBoundary={document.documentElement}
    options={{ debug: true }}
    onChange={action('change')}
  />
);
