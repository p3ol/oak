import * as Y from 'yjs';

import { getYContent, getYjsContent, setYjsContent } from './sync';

// Two documents synchronized together, like two users connected to a server
const connect = () => {
  const a = new Y.Doc();
  const b = new Y.Doc();
  a.on('update', (update: Uint8Array, origin: unknown) => {
    if (origin !== b) Y.applyUpdate(b, update, a);
  });
  b.on('update', (update: Uint8Array, origin: unknown) => {
    if (origin !== a) Y.applyUpdate(a, update, b);
  });

  return [a, b];
};

const content = () => [
  { id: 'row', type: 'row', cols: [
    { id: 'col', type: 'col', content: [
      { id: 'title', type: 'title', content: 'Title', settings: { size: 1 } },
      { id: 'text', type: 'text', content: 'Text' },
    ] },
  ] },
  { id: 'button', type: 'button', content: 'Click', styles: { paddingTop: 4 } },
];

describe('yjs sync', () => {
  it('should store & synchronize the content', () => {
    const [a, b] = connect();
    setYjsContent(a, content());

    expect(getYjsContent(b)).toEqual(content());
  });

  it('should only write what changed', () => {
    const doc = new Y.Doc();
    setYjsContent(doc, content());
    const title = (getYContent(doc).get(0) as Y.Map<any>)
      .get('cols').get(0).get('content').get(0);
    const updates: Uint8Array[] = [];
    doc.on('update', (u: Uint8Array) => updates.push(u));

    const next = content();
    next[0].cols[0].content[0].content = 'New title';
    setYjsContent(doc, next);

    // The element itself was kept (updated in place, not re-created)
    expect((getYContent(doc).get(0) as Y.Map<any>)
      .get('cols').get(0).get('content').get(0)).toBe(title);
    expect(title.get('content')).toBeInstanceOf(Y.Text);
    expect(title.get('content').toString()).toBe('New title');
    expect(updates.length).toBe(1);

    setYjsContent(doc, next);
    expect(updates.length).toBe(1);
  });

  it('should merge concurrent changes to the same element', () => {
    const a = new Y.Doc();
    const b = new Y.Doc();
    setYjsContent(a, content());
    Y.applyUpdate(b, Y.encodeStateAsUpdate(a));

    // Both users change different values of the same element offline...
    const fromA = content();
    fromA[1].content = 'Subscribe';
    setYjsContent(a, fromA);

    const fromB = content();
    fromB[1].styles.paddingTop = 12;
    setYjsContent(b, fromB);

    // ...then synchronize
    Y.applyUpdate(a, Y.encodeStateAsUpdate(b));
    Y.applyUpdate(b, Y.encodeStateAsUpdate(a));

    const expected = content();
    expected[1].content = 'Subscribe';
    expected[1].styles.paddingTop = 12;
    expect(getYjsContent(a)).toEqual(expected);
    expect(getYjsContent(b)).toEqual(expected);
  });

  it('should move, insert & remove elements', () => {
    const [a, b] = connect();
    setYjsContent(a, content());

    const [row, button] = content();
    const text = { id: 'new', type: 'text', content: 'New' };
    row.cols[0].content.reverse();
    setYjsContent(a, [button, text, row]);

    expect(getYjsContent(b)).toEqual([button, text, row]);

    setYjsContent(a, [row]);
    expect(getYjsContent(b)).toEqual([row]);
  });

  it('should merge concurrent typing in the same text', () => {
    const a = new Y.Doc();
    const b = new Y.Doc();
    setYjsContent(a, content());
    Y.applyUpdate(b, Y.encodeStateAsUpdate(a));

    // Alice types at the start of the button, Bob at its end, at the same time
    const fromA = content();
    fromA[1].content = 'Please click';
    setYjsContent(a, fromA);

    const fromB = content();
    fromB[1].content = 'Click here';
    setYjsContent(b, fromB);

    Y.applyUpdate(a, Y.encodeStateAsUpdate(b));
    Y.applyUpdate(b, Y.encodeStateAsUpdate(a));

    expect(getYjsContent(a)[1].content).toBe('Please click here');
    expect(getYjsContent(b)[1].content).toBe('Please click here');
  });
});

