import { action } from 'storybook/actions';
import {
  type ElementObject,
  type AddonObject,
  Builder,
  baseAddon,
} from '@oakjs/react';
import { FieldOverrideObject } from 'packages/core/dist/types';

import { ckeditorFieldAddon } from './addons';

export default { title: 'React/With addon: CKEditor' };
import './index.stories.sass';

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
  } ],
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

export const WithCustomserializer = () => {
  const richAddon = addon;
  const fieldOveride: FieldOverrideObject = {
    type: 'field',
    targets: ['text', 'title', 'button'],
    keys: ['content'],
    serialize: (val: string): string => {
      const regex = /<p\s*\b/g;
      const spanned = val
        .replace(regex, '<span class="custom-class" ')
        .replace(/<\/p>/g, '</span>');

      return spanned;
    },
    unserialize: (val: string): string => {
      const regex = /<span\s+class="custom-class"/g;
      const unSpanned = val
        .replace(regex, '<p ')
        .replace(/<\/span>/g, '</p>');

      return unSpanned;
    },
  };

  return (
    <Builder
      addons={[baseAddon(), ckeditorFieldAddon({
        config: {
          licenseKey: 'GPL',
        },
      }), {...addon, overrides: [...richAddon.overrides!, fieldOveride]}]}
      value={baseContent}
      rootBoundary={document.documentElement}
      options={{ debug: true }}
      onChange={action('change')}
    />
  );
};
