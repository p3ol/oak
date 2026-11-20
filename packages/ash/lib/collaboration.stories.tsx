import { useEffect, useMemo } from 'react';
import * as Y from 'yjs';
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} from 'y-protocols/awareness';
import { ckeditorFieldAddon } from '@oakjs/addon-ckeditor5-react';
import { remirrorFieldAddon } from '@oakjs/addon-remirror';

import type { AshAddonObject } from './types';
import { setYjsContent, useYjs } from './yjs';
import Builder from './Builder';
import { baseAddon } from './addons';
import { paywallContent, withIds } from './stories.fixtures';
import './index.css';

export default {
  title: 'Ash/Collaboration',
  parameters: { layout: 'fullscreen' },
};

// Addons must be stable: define them once
const addons = [baseAddon()];

const ckeditorAddons = [
  baseAddon(),
  ckeditorFieldAddon({ config: { licenseKey: 'GPL' } }) as AshAddonObject,
  {
    overrides: [{
      type: 'component',
      targets: ['text', 'title', 'button'],
      fields: [{ key: 'content', type: 'ckeditor' }],
    }],
  } as AshAddonObject,
];

const remirrorAddons = [
  baseAddon(),
  remirrorFieldAddon() as AshAddonObject,
  {
    overrides: [{
      type: 'component',
      targets: ['text', 'title', 'button'],
      fields: [{ key: 'content', type: 'remirror' }],
    }],
  } as AshAddonObject,
];

const content = withIds(paywallContent);

/**
 * Two documents & awareness instances synchronized in memory, like two
 * browsers connected through a provider (y-websocket, y-webrtc...)
 */
const createSession = () => {
  const docs = [new Y.Doc(), new Y.Doc()];
  const awarenesses = docs.map(doc => new Awareness(doc));

  // The document is initialized once, before being shared
  setYjsContent(docs[0], content);
  Y.applyUpdate(docs[1], Y.encodeStateAsUpdate(docs[0]), 'remote');

  docs.forEach((doc, i) => {
    const other = docs[1 - i];

    doc.on('update', (update: Uint8Array, origin: unknown) => {
      if (origin !== 'remote') {
        Y.applyUpdate(other, update, 'remote');
      }
    });
  });

  awarenesses.forEach((awareness, i) => {
    const other = awarenesses[1 - i];

    awareness.on('update', ({ added, updated, removed }: {
      added: number[];
      updated: number[];
      removed: number[];
    }, origin: unknown) => {
      if (origin !== 'remote') {
        applyAwarenessUpdate(
          other,
          encodeAwarenessUpdate(awareness, [...added, ...updated, ...removed]),
          'remote',
        );
      }
    });
  });

  return { docs, awarenesses };
};

const Editor = ({
  doc,
  awareness,
  addons,
  name,
  color,
}: {
  doc: Y.Doc;
  awareness: Awareness;
  addons: AshAddonObject[];
  name: string;
  color: string;
}) => {
  const collaboration = useYjs({ doc, awareness, user: { name, color } });

  return (
    <Builder
      addons={addons}
      { ...collaboration }
      defaultPageWidth={420}
      leftSidebarWidth={210}
      rightSidebarWidth={250}
      header={(
        <div className="oak:flex oak:items-center oak:gap-2 oak:text-[13px]">
          <span
            className="oak:w-2.5 oak:h-2.5 oak:rounded-full"
            style={{ background: color }}
          />
          <strong>{ name }</strong>
          <span className="oak:text-ash-text-muted">is editing</span>
        </div>
      )}
    />
  );
};

const Session = ({ addons }: { addons: AshAddonObject[] }) => {
  const { docs, awarenesses } = useMemo(createSession, []);

  useEffect(() => () => {
    awarenesses.forEach(a => a.destroy());
    docs.forEach(d => d.destroy());
  }, [docs, awarenesses]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, minWidth: 0, borderRight: '4px solid #1A1A1A' }}>
        <Editor
          doc={docs[0]}
          awareness={awarenesses[0]}
          addons={addons}
          name="Alice"
          color="var(--junipero-grapefruit)"
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Editor
          doc={docs[1]}
          awareness={awarenesses[1]}
          addons={addons}
          name="Bob"
          color="var(--junipero-lime)"
        />
      </div>
    </div>
  );
};

/**
 * Two users editing the same content: changes, selections & undo/redo (each
 * user only undoes their own changes) are synchronized through Yjs. Select
 * the same element on both sides and type in the same field: both changes are
 * kept.
 */
export const TwoEditors = () => <Session addons={addons} />;

/** Same, with texts edited with CKEditor */
export const WithCKEditor = () => <Session addons={ckeditorAddons} />;

/** Same, with texts edited with Remirror */
export const WithRemirror = () => <Session addons={remirrorAddons} />;
