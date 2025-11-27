import { action } from 'storybook/actions';
import {
  type ElementObject,
  type AddonObject,
  Builder,
  baseAddon,
} from '@oakjs/react';
import type { SettingOverrideObject } from 'packages/core/dist/types';

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

export const WithCustomserializer = () => {
  const richAddon = addon;
  const fieldOveride: SettingOverrideObject = {
    type: 'setting',
    targets: ['title'],
    key: 'content',
    serialize: (val): string => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(val, 'text/html');
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);

      let node;

      while ((node = walker.nextNode())) {
        node.textContent = node.textContent!.split('').map(char => {
          let c = char.charCodeAt(0);

          switch (c) {
            case 90: return 'A';
            case 122: return 'a';
            default: return String.fromCharCode(++c);
          }
        }).join('');
      }

      return doc.body.innerHTML;
    },
    unserialize: (val: string): string => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(val, 'text/html');
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);

      let node;

      while ((node = walker.nextNode())) {
        node.textContent = node.textContent!.split('').map(char => {
          let c = char.charCodeAt(0);

          switch (c) {
            case 90: return 'A';
            case 122: return 'a';
            default: return String.fromCharCode(--c);
          }
        }).join('');
      }

      return doc.body.innerHTML;
    },
  };

  return (
    <Builder
      addons={[baseAddon(), ckeditorFieldAddon({
        config: {
          licenseKey: 'GPL',
        },
      }), {...addon, overrides: [...richAddon.overrides, fieldOveride]}]}
      value={baseContent}
      rootBoundary={document.documentElement}
      options={{ debug: true }}
      onChange={action('change')}
    />
  );
};
