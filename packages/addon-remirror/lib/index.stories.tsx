import { action } from 'storybook/actions';
import {
  type ElementObject,
  type AddonObject,
  Builder,
  baseAddon,
} from '@oakjs/react';

import { remirrorFieldAddon } from './addons';

export default { title: 'React/With addon: Remirror' };

const baseContent: ElementObject[] = [
  { type: 'text', content: 'This is a title' },
];

const addon: AddonObject = {
  overrides: [{
    type: 'component',
    targets: ['text', 'title', 'button'],
    fields: [{
      key: 'content',
      type: 'remirror',
    }],
  }],
};

export const Basic = () => (
  <Builder
    addons={[baseAddon(), remirrorFieldAddon(), addon]}
    value={baseContent}
    rootBoundary={document.documentElement}
    options={{ debug: true }}
    onChange={action('change')}
  />
);
