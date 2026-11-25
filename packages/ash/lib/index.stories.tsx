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
import { paywallContent, withIds } from './stories.fixtures';
import './index.css';

export default {
  title: 'Ash/Builder',
  parameters: { layout: 'fullscreen' },
};

// Addons must be stable (defined once, or memoized): changing them makes the
// builder re-register every component & field
const addons = [baseAddon()];
const darkModeAddons = [baseAddon({ darkMode: true })];

export const Basic = () => (
  <div style={{ height: '100vh' }}>
    <Builder
      addons={darkModeAddons}
      defaultValue={paywallContent}
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
  const [value, setValue] = useState<ElementObject[]>(paywallContent);

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
      defaultValue={paywallContent}
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
        defaultValue={paywallContent}
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
      defaultValue={paywallContent}
      defaultPageWidth={720}
      pageTitle="Appearance"
      pageDescription="Paywall · The Daily Oak"
    />
  </div>
);

type SaveStatus = 'saved' | 'unsaved' | 'saving';

const SAVE_STATUSES: Record<SaveStatus, string> = {
  saved: 'All changes saved',
  unsaved: 'Unsaved changes',
  saving: 'Saving…',
};

/**
 * Custom zone above the layers & insert panels, with a back & a save button.
 * It is rendered inside the builder, so it can use the builder hooks: `save()`
 * saves like Cmd/Ctrl + S (committing pending property changes first).
 */
const DashboardHeader = ({ status }: { status: SaveStatus }) => {
  const { save } = useBuilder();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        type="button"
        aria-label="Back to paywalls"
        onClick={action('back')}
        className={[
          'oak:flex oak:flex-none oak:items-center oak:justify-center',
          'oak:w-8 oak:h-8 oak:rounded-md oak:border-0 oak:bg-transparent',
          'oak:text-ash-text oak:cursor-pointer oak:hover:bg-ash-muted',
        ].join(' ')}
      >
        <ChevronIcon style={{ transform: 'scaleX(-1)' }} />
      </button>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="oak:text-[13px] oak:font-semibold oak:truncate">
          Paywall · The Daily Oak
        </div>
        <div className="oak:text-[11px] oak:text-ash-text-muted">
          { SAVE_STATUSES[status] }
        </div>
      </div>
      <button
        type="button"
        title="Save (⌘S)"
        disabled={status === 'saving'}
        onClick={() => save()}
        className={[
          'oak:flex-none oak:h-8 oak:px-3 oak:rounded-md oak:border-0',
          'oak:bg-velvet oak:text-seashell oak:text-[13px] oak:font-medium',
          'oak:cursor-pointer oak:enabled:hover:bg-velvet-hover',
          'oak:disabled:opacity-50 oak:disabled:cursor-default',
        ].join(' ')}
      >
        Save
      </button>
    </div>
  );
};

export const WithSidebarHeader = () => {
  const [status, setStatus] = useState<SaveStatus>('saved');

  const onSave = async (content: ElementObject[]) => {
    setStatus('saving');
    // Simulates a request to the dashboard's api
    await new Promise(resolve => setTimeout(resolve, 600));
    action('save')(content);
    setStatus('saved');
  };

  return (
    <div style={{ height: '100vh' }}>
      <Builder
        addons={addons}
        defaultValue={paywallContent}
        defaultPageWidth={720}
        header={<DashboardHeader status={status} />}
        headerClassName="oak:px-2 oak:py-2 oak:border-b oak:border-ash-border"
        onChange={() => setStatus('unsaved')}
        onSave={onSave}
      />
    </div>
  );
};

/**
 * Other users' selections, as they would be shared through a collaboration
 * tool (e.g. Yjs's awareness). See `onSelectionChange` to share yours.
 */
export const WithCollaborators = () => (
  <div style={{ height: '100vh' }}>
    <Builder
      addons={addons}
      defaultValue={withIds(paywallContent)}
      defaultPageWidth={720}
      onSelectionChange={action('selectionChange')}
      collaborators={[
        { id: 'alice', name: 'Alice', selectedId: 'e1' },
        { id: 'bob', name: 'Bob', selectedId: 'e4-1' },
        { id: 'carol', name: 'Carol', selectedId: 'e7' },
      ]}
    />
  </div>
);
