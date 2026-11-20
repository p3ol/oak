import type { ElementObject, GetTextCallback } from '@oakjs/core';
import { ckeditorFieldAddon } from '@oakjs/addon-ckeditor5-react';
import { action } from 'storybook/actions';

import type {
  AshAddonObject,
  AshComponentObject,
} from './types';
import {
  type RendererComponentProps,
  HTMLContent,
  containerAttributes,
  mergeAttributes,
  renderers,
} from './index';
import Builder from './Builder';
import { baseAddon } from './addons';
import './index.css';

export default {
  title: 'Ash/Addons',
  parameters: { layout: 'fullscreen' },
};

/* ---------------------------------------------------------------------------
 * A new addon declaring components (in their own catalogue group)
 * ------------------------------------------------------------------------ */

const Quote = ({ element, attributes, sanitizeHTML }: RendererComponentProps) => (
  <figure
    { ...mergeAttributes(attributes, {
      style: {
        margin: 0,
        padding: '16px 20px',
        borderLeft: `4px solid ${element.settings?.accent || '#5C56DF'}`,
        borderRadius: 8,
        background: '#F6F6FD',
      },
    }) }
  >
    <HTMLContent
      tag="blockquote"
      html={element.content as string}
      sanitizeHTML={sanitizeHTML}
      style={{ margin: 0, fontSize: 18, fontStyle: 'italic' }}
    />
    { element.author && (
      <figcaption style={{ marginTop: 8, fontSize: 14, color: '#6B778C' }}>
        — { element.author }
      </figcaption>
    ) }
  </figure>
);

const quoteComponent = (): AshComponentObject => ({
  id: 'quote',
  type: 'component',
  name: (t: GetTextCallback) => t('stories.components.quote.name', 'Quote'),
  icon: 'multiline',
  editable: true,
  duplicable: true,
  copyable: true,
  construct: () => ({
    type: 'quote',
    content: '<p>Independent journalism is worth paying for.</p>',
    author: 'A happy reader',
  }),
  render: Quote,
  settings: {
    title: 'Quote options',
    fields: [{
      type: 'textarea',
      key: 'content',
      label: 'Quote',
      priority: 30,
    }, {
      type: 'text',
      key: 'author',
      label: 'Author',
      priority: 20,
    }, {
      type: 'color',
      key: 'settings.accent',
      label: 'Accent color',
      placeholder: '#5C56DF',
      priority: 10,
    }],
  },
});

// A container component with two slots: `header` & `content`
const Card = ({ attributes, renderContainer }: RendererComponentProps) => (
  <div
    { ...mergeAttributes(attributes, {
      style: {
        border: '1px solid #DFE1E6',
        borderRadius: 12,
        overflow: 'hidden',
      },
    }) }
  >
    <div
      { ...containerAttributes('header') }
      style={{ padding: '12px 16px', background: '#F3F3F3' }}
    >
      { renderContainer('header') }
    </div>
    <div { ...containerAttributes('content') } style={{ padding: 16 }}>
      { renderContainer('content') }
    </div>
  </div>
);

const cardComponent = (): AshComponentObject => ({
  id: 'card',
  type: 'component',
  name: (t: GetTextCallback) => t('stories.components.card.name', 'Card'),
  icon: 'appearences',
  editable: true,
  duplicable: true,
  construct: () => ({
    type: 'card',
    header: [{ type: 'title', headingLevel: 'h4', content: 'Card title' }],
    content: [{ type: 'text', content: '<p>Card content</p>' }],
  }),
  getContainers: (element: ElementObject) => [element.header, element.content],
  render: Card,
});

const marketingAddon = (): AshAddonObject => ({
  components: [{
    type: 'group',
    id: 'marketing',
    name: (t: GetTextCallback) =>
      t('stories.groups.marketing', 'Marketing'),
    components: [quoteComponent(), cardComponent()],
  }],
});

/* ---------------------------------------------------------------------------
 * An addon only changing existing components & settings (overrides).
 * Only the first component override targeting a component is used (unless
 * the `overrideStrategy: 'merge'` option is set): group them by target.
 * ------------------------------------------------------------------------ */

// Reuses the base button renderer, with brand variants
const BrandButton = (props: RendererComponentProps) => (
  <renderers.Button
    { ...props }
    attributes={mergeAttributes(props.attributes, {
      style: props.element.settings?.variant === 'secondary'
        ? {
          background: 'transparent',
          color: '#5C56DF',
          boxShadow: 'inset 0 0 0 2px #5C56DF',
        }
        : {
          background: 'linear-gradient(90deg, #5C56DF, #807BFC)',
          color: '#FFFFFF',
        },
    })}
  />
);

const brandAddon = (): AshAddonObject => ({
  overrides: [{
    // Rich text edition (ckeditor) for html contents
    type: 'component',
    targets: ['text', 'title', 'quote'],
    fields: [{ key: 'content', type: 'ckeditor' }],
  }, {
    // Custom renderer + new field for buttons
    type: 'component',
    targets: ['button'],
    render: BrandButton,
    fields: [{
      key: 'content',
      type: 'ckeditor',
    }, {
      key: 'settings.variant',
      type: 'select',
      label: 'Variant',
      default: 'primary',
      displayable: true,
      priority: 100,
      options: [
        { title: 'Primary', value: 'primary' },
        { title: 'Secondary', value: 'secondary' },
      ],
    }],
  }, {
    // Cards cannot be nested
    type: 'component',
    targets: ['card'],
    disallow: ['card'],
  }, {
    // Rename a setting for every component
    type: 'setting',
    targets: ['*'],
    key: 'styles.backgroundColor',
    label: 'Background',
  }],
});

/* ---------------------------------------------------------------------------
 * Story
 * ------------------------------------------------------------------------ */

// Addons must be stable: define them once
const addons = [
  baseAddon(),
  // Provides the `ckeditor` field type
  ckeditorFieldAddon({ config: { licenseKey: 'GPL' } }) as AshAddonObject,
  marketingAddon(),
  brandAddon(),
];

const content: ElementObject[] = [
  {
    type: 'title',
    headingLevel: 'h2',
    content: 'Support <strong>independent</strong> journalism',
  },
  {
    type: 'text',
    content: '<p>Rich text is edited with <em>CKEditor</em>: select this ' +
      'text and edit it in the properties panel.</p>',
  },
  { type: 'empty-space', settings: { height: '16px' } },
  {
    type: 'quote',
    content: '<p>The only news site I actually read every morning.</p>',
    author: 'Camille, subscriber since 2021',
  },
  { type: 'empty-space', settings: { height: '16px' } },
  { type: 'row', settings: { gap: '16px', alignItems: 'stretch' }, cols: [
    { type: 'col', content: [{
      type: 'card',
      header: [{ type: 'title', headingLevel: 'h4', content: 'Monthly' }],
      content: [
        { type: 'text', content: '<p><strong>€9.99</strong> / month</p>' },
        {
          type: 'button',
          content: 'Subscribe',
          settings: { variant: 'secondary' },
        },
      ],
    }] },
    { type: 'col', content: [{
      type: 'card',
      header: [{ type: 'title', headingLevel: 'h4', content: 'Yearly' }],
      content: [
        { type: 'text', content: '<p><strong>€89</strong> / year</p>' },
        { type: 'button', content: 'Subscribe', settings: { variant: 'primary' } },
      ],
    }] },
  ] },
];

export const WithAddonsAndOverrides = () => (
  <div style={{ height: '100vh' }}>
    <Builder
      addons={addons}
      defaultValue={content}
      defaultPageWidth={720}
      onChange={action('change')}
    />
  </div>
);
