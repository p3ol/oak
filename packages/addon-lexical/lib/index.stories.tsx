import { action } from 'storybook/actions';
import {
  type ElementObject,
  type AddonObject,
  Builder,
  baseAddon,
} from '@oakjs/react';

import { lexicalFieldAddon } from './addons';

export default { title: 'React/With addon: Lexical' };

const baseContent: ElementObject[] = [
  { type: 'text', content: '<p>This is a <strong>rich</strong> text</p>' },
];

const addon: AddonObject = {
  overrides: [{
    type: 'component',
    targets: ['text', 'title', 'button'],
    fields: [{
      key: 'content',
      type: 'lexical',
    }],
  }],
};

const addons = [baseAddon(), lexicalFieldAddon(), addon];

export const Basic = () => (
  <Builder
    addons={addons}
    value={baseContent}
    rootBoundary={document.documentElement}
    options={{ debug: true }}
    onChange={action('change')}
  />
);
