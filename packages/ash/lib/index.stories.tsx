import { useState } from 'react';
import type { ElementObject } from '@oakjs/core';
import { action } from 'storybook/actions';

import type {
  AshAddonObject,
  AshFieldObject,
  PageSettingObject,
  PageValue,
} from './types';
import { useBuilder } from './hooks';
import ChevronIcon from './Icon/ChevronIcon';
import Builder from './Builder';
import { baseAddon } from './addons';
import './index.css';

export default {
  title: 'Ash/Builder',
  parameters: { layout: 'fullscreen' },
};

const offer = ({
  name,
  price,
  period,
  perks,
  highlighted = false,
}: {
  name: string;
  price: string;
  period: string;
  perks: string[];
  highlighted?: boolean;
}): ElementObject => ({
  type: 'col',
  size: 6,
  responsive: { xs: 12 },
  styles: {
    paddingTop: '24px',
    paddingRight: '24px',
    paddingBottom: '24px',
    paddingLeft: '24px',
    borderTop: '1px',
    borderRight: '1px',
    borderBottom: '1px',
    borderLeft: '1px',
    borderTopColor: highlighted ? '#5C56DF' : '#DFE1E6',
    borderRightColor: highlighted ? '#5C56DF' : '#DFE1E6',
    borderBottomColor: highlighted ? '#5C56DF' : '#DFE1E6',
    borderLeftColor: highlighted ? '#5C56DF' : '#DFE1E6',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    borderBottomRightRadius: '12px',
    borderBottomLeftRadius: '12px',
    backgroundColor: highlighted ? '#F6F6FD' : '#FFFFFF',
    // Used when the content is displayed in dark mode
    dark: {
      backgroundColor: highlighted ? '#2A284B' : '#1C1C1C',
      borderTopColor: highlighted ? '#5C56DF' : '#333333',
      borderRightColor: highlighted ? '#5C56DF' : '#333333',
      borderBottomColor: highlighted ? '#5C56DF' : '#333333',
      borderLeftColor: highlighted ? '#5C56DF' : '#333333',
    },
  },
  content: [
    { type: 'title', headingLevel: 'h3', content: name },
    {
      type: 'text',
      content: `<p><strong style="font-size: 28px">${price}</strong>` +
        ` / ${period}</p>`,
    },
    {
      type: 'text',
      content: `<ul>${perks.map(p => `<li>${p}</li>`).join('')}</ul>`,
    },
    { type: 'empty-space', settings: { height: '8px' } },
    {
      type: 'button',
      content: `Subscribe ${period === 'month' ? 'monthly' : 'yearly'}`,
      action: 'link',
      url: 'https://example.com/subscribe',
      styles: highlighted ? {
        backgroundColor: '#5C56DF',
        hover: { backgroundColor: '#4D47CB' },
        dark: {
          backgroundColor: '#5C56DF',
          hover: { backgroundColor: '#807BFC' },
        },
      } : {},
    },
  ],
});

const baseContent: ElementObject[] = [
  {
    type: 'image',
    url: 'https://avatars.githubusercontent.com/u/20414672',
    settings: {
      size: 'custom',
      width: '48px',
      height: '48px',
      textAlign: 'left',
      alt: 'The Daily Oak',
    },
  },
  {
    type: 'title',
    headingLevel: 'h2',
    content: 'You\'ve reached your free articles limit',
    styles: { marginBottom: '8px' },
  },
  {
    type: 'text',
    content: '<p>Subscribe to The Daily Oak to keep reading unlimited ' +
      'articles, newsletters & podcasts. Cancel anytime.</p>',
  },
  { type: 'empty-space', settings: { height: '16px' } },
  { type: 'row', settings: { gap: '16px', alignItems: 'stretch' }, cols: [
    offer({
      name: 'Monthly',
      price: '€9.99',
      period: 'month',
      perks: ['Unlimited articles', 'Ad-free reading'],
    }),
    offer({
      name: 'Yearly',
      price: '€89',
      period: 'year',
      perks: ['Unlimited articles', 'Ad-free reading', '2 months free'],
      highlighted: true,
    }),
  ] },
  { type: 'empty-space', settings: { height: '16px' } },
  {
    type: 'foldable',
    seeMore: [{ type: 'text', content: '<p>Why subscribe? ▾</p>' }],
    seeLess: [{ type: 'text', content: '<p>Show less ▴</p>' }],
    content: [{
      type: 'text',
      content: '<p>Our newsroom is 100% funded by readers like you: no ' +
        'billionaire, no clickbait, just independent journalism.</p>',
    }],
  },
  {
    type: 'clickable',
    action: 'event',
    event: 'login',
    content: [{
      type: 'text',
      content: '<p>Already a subscriber? <u>Log in</u></p>',
      styles: { paddingTop: '8px' },
    }],
  },
];

// Addons must be stable (defined once, or memoized): changing them makes the
// builder re-register every component & field
const addons = [baseAddon()];
const darkModeAddons = [baseAddon({ darkMode: true })];

export const Basic = () => (
  <div style={{ height: '100vh' }}>
    <Builder
      addons={darkModeAddons}
      defaultValue={baseContent}
      defaultPageWidth={720}
      onChange={action('change')}
    />
  </div>
);

export const Empty = () => (
  <div style={{ height: '100vh' }}>
    <Builder addons={addons} onChange={action('change')} />
  </div>
);

export const Controlled = () => {
  const [value, setValue] = useState<ElementObject[]>(baseContent);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 8, display: 'flex', gap: 8 }}>
        <button
          onClick={() => setValue(v => [
            ...v, { type: 'text', content: '<p>Terms & conditions apply.</p>' },
          ])}
        >
          Add text from outside
        </button>
        <span>{ value.length } root elements</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Builder addons={addons} value={value} onChange={setValue} />
      </div>
    </div>
  );
};

const disallowAddons: AshAddonObject[] = [baseAddon(), {
  overrides: [{
    type: 'component',
    targets: ['clickable'],
    disallow: ['button', 'clickable'],
  }],
}];

export const WithDisallowedChildren = () => (
  <div style={{ height: '100vh' }}>
    <Builder
      addons={disallowAddons}
      defaultValue={baseContent}
    />
  </div>
);

/**
 * Custom page settings, like a custom css field (a monaco-editor field in a
 * real integration), applied to the page through `renderPageHead`
 */
const codeField = (): AshFieldObject => ({
  type: 'code',
  render: ({ value, onChange, fieldOptions }) => (
    <textarea
      value={value ?? ''}
      spellCheck={false}
      rows={8}
      placeholder={fieldOptions?.setting?.placeholder as string}
      onChange={e => onChange({ value: e.target.value })}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'ui-monospace, Menlo, monospace',
        fontSize: 12,
        padding: 8,
        borderRadius: 4,
        border: '1px solid var(--ash-border)',
        background: 'var(--ash-field-bg)',
        color: 'var(--ash-text)',
      }}
    />
  ),
});

const customCssAddon = (): AshAddonObject => ({
  fields: [codeField()],
  pageSettings: [{
    type: 'code',
    key: 'customCss',
    label: 'Custom CSS',
    placeholder: '.oak-ash-page h2 { color: red; }',
    description: 'Applied to the whole page',
  }],
});

const pageSettingsAddons = [baseAddon(), customCssAddon()];

const pageSettings: PageSettingObject[] = [{
  type: 'text',
  key: 'trackingId',
  label: 'Tracking ID',
  placeholder: 'UA-XXXXX',
  priority: 10,
}];

const renderPageHead = (value: PageValue) => value.customCss
  ? <style>{ value.customCss }</style>
  : null;

export const WithPageSettings = () => {
  const [page, setPage] = useState<PageValue>({
    customCss: '.oak-ash-page h2 {\n  color: #5C56DF;\n}',
    trackingId: '',
  });

  return (
    <div style={{ height: '100vh' }}>
      <Builder
        addons={pageSettingsAddons}
        defaultValue={baseContent}
        defaultPageWidth={720}
        pageSettings={pageSettings}
        pageValue={page}
        onPageChange={value => {
          setPage(value);
          action('pageChange')(value);
        }}
        renderPageHead={renderPageHead}
      />
    </div>
  );
};

/**
 * Primary color changed with a single css variable, and custom page
 * properties title
 */
export const WithCustomPrimaryColor = () => (
  <div style={{ height: '100vh' }}>
    <style>
      { '.custom-primary, .custom-primary * { --junipero-velvet: #E11D48; }' }
    </style>
    <Builder
      className="custom-primary"
      addons={addons}
      defaultValue={baseContent}
      defaultPageWidth={720}
      pageTitle="Appearance"
      pageDescription="Paywall · The Daily Oak"
    />
  </div>
);

/**
 * Custom zone above the layers & insert panels. It is rendered inside the
 * builder, so it can use the builder hooks (here, to display a save status).
 */
const DashboardHeader = () => {
  const { canUndo } = useBuilder();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        type="button"
        aria-label="Back to paywalls"
        onClick={action('back')}
        className={[
          'oak:flex oak:items-center oak:justify-center oak:w-8 oak:h-8',
          'oak:rounded-md oak:border-0 oak:bg-transparent oak:text-ash-text',
          'oak:cursor-pointer oak:hover:bg-ash-muted',
        ].join(' ')}
      >
        <ChevronIcon style={{ transform: 'scaleX(-1)' }} />
      </button>
      <div style={{ minWidth: 0 }}>
        <div className="oak:text-[13px] oak:font-semibold oak:truncate">
          Paywall · The Daily Oak
        </div>
        <div className="oak:text-[11px] oak:text-ash-text-muted">
          { canUndo ? 'Unsaved changes' : 'All changes saved' }
        </div>
      </div>
    </div>
  );
};

export const WithSidebarHeader = () => (
  <div style={{ height: '100vh' }}>
    <Builder
      addons={addons}
      defaultValue={baseContent}
      defaultPageWidth={720}
      header={<DashboardHeader />}
      headerClassName="oak:px-2 oak:py-2 oak:border-b oak:border-ash-border"
    />
  </div>
);
