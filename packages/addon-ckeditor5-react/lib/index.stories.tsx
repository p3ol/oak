import { action } from 'storybook/actions';
import {
  type ElementObject,
  type AddonObject,
  Builder,
  baseAddon,
} from '@oakjs/react';

import { ckeditorFieldAddon } from './addons';

export default { title: 'React/With addon: CKEditor' };

const baseContent: ElementObject[] = [
  { type: 'text', content: 'This is a title' },
];

const addon: AddonObject = {
  overrides: [{
    type: 'component',
    targets: ['text', 'title', 'button'],
    fields: [{
      key: 'content',
      type: 'ckeditor',
    }],
  }],
};

export const Basic = () => (
  <Builder
    addons={[baseAddon(), ckeditorFieldAddon({
      config: {
        licenseKey: 'GPL',
      },
    }), addon]}
    value={baseContent}
    rootBoundary={document.documentElement}
    options={{ debug: true }}
    onChange={action('change')}
  />
);
