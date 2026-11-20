import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
import { act, renderHook } from '@testing-library/react';

import { useYjs } from './useYjs';
import { getYjsContent, setYjsContent } from './sync';

const content = () => [
  { id: 'title', type: 'title', content: 'Title' },
  { id: 'text', type: 'text', content: 'Text' },
];

describe('useYjs', () => {
  it('should initialize the document & receive remote changes', () => {
    const doc = new Y.Doc();
    const { result } = renderHook(() => useYjs({
      doc, defaultValue: content(),
    }));

    expect(getYjsContent(doc)).toEqual(content());
    expect(result.current.value).toEqual(content());

    // Remote change
    act(() => {
      setYjsContent(doc, [{ id: 'title', type: 'title', content: 'Remote' }]);
    });
    expect(result.current.value).toEqual([
      { id: 'title', type: 'title', content: 'Remote' },
    ]);
  });

  it('should only undo local changes', () => {
    const doc = new Y.Doc();
    setYjsContent(doc, content());
    const { result } = renderHook(() => useYjs({ doc, captureTimeout: 0 }));

    // Local change
    act(() => {
      const next = content();
      next[0].content = 'Local';
      result.current.onChange(next);
    });
    expect(result.current.history.canUndo).toBe(true);

    // Remote change
    act(() => {
      const next = content();
      next[0].content = 'Local';
      next[1].content = 'Remote';
      setYjsContent(doc, next);
    });

    act(() => {
      result.current.history.undo();
    });

    expect(getYjsContent(doc)).toEqual([
      { id: 'title', type: 'title', content: 'Title' },
      { id: 'text', type: 'text', content: 'Remote' },
    ]);
    expect(result.current.value).toEqual(getYjsContent(doc));
    expect(result.current.history.canRedo).toBe(true);
  });

  it('should share page settings', () => {
    const doc = new Y.Doc();
    const { result } = renderHook(() => useYjs({ doc }));

    act(() => {
      result.current.onPageChange({ customCss: 'h1 {}' });
    });
    expect(doc.getMap('oak:page').toJSON()).toEqual({ customCss: 'h1 {}' });
  });

  it('should share selections through the awareness', () => {
    const docA = new Y.Doc();
    const docB = new Y.Doc();
    const awarenessA = new Awareness(docA);
    const awarenessB = new Awareness(docB);

    const { result: a } = renderHook(() => useYjs({
      doc: docA, awareness: awarenessA, user: { name: 'Alice' },
    }));
    const { result: b } = renderHook(() => useYjs({
      doc: docB, awareness: awarenessB, user: { name: 'Bob' },
    }));

    act(() => {
      a.current.onSelectionChange('title');
    });

    // Simulates the awareness protocol (done by providers)
    act(() => {
      awarenessB.states.set(awarenessA.clientID, awarenessA.getLocalState());
      awarenessB.emit('change', [{ added: [awarenessA.clientID] }, 'remote']);
    });

    expect(b.current.collaborators).toEqual([{
      id: awarenessA.clientID,
      name: 'Alice',
      color: undefined,
      selectedId: 'title',
      cursor: null,
    }]);
    expect(a.current.collaborators).toEqual([]);
  });

  it('should share cursors in fields through the awareness', () => {
    const docA = new Y.Doc();
    const docB = new Y.Doc();
    const awarenessA = new Awareness(docA);
    const awarenessB = new Awareness(docB);

    const { result: a } = renderHook(() => useYjs({
      doc: docA, awareness: awarenessA, user: { name: 'Alice' },
    }));
    const { result: b } = renderHook(() => useYjs({
      doc: docB, awareness: awarenessB, user: { name: 'Bob' },
    }));
    const sync = () => act(() => {
      awarenessB.states.set(awarenessA.clientID, awarenessA.getLocalState());
      awarenessB.emit('change', [{ updated: [awarenessA.clientID] }, 'remote']);
    });

    act(() => {
      a.current.onCursorChange({
        elementId: 'title', key: 'content', anchor: 2, head: 5,
      });
    });
    sync();

    expect(b.current.collaborators[0].cursor).toEqual({
      elementId: 'title', key: 'content', anchor: 2, head: 5,
    });

    // Unchanged states don't update the collaborators
    const previous = b.current.collaborators;
    sync();
    expect(b.current.collaborators).toBe(previous);

    act(() => {
      a.current.onCursorChange(null);
    });
    sync();
    expect(b.current.collaborators[0].cursor).toBeNull();
  });
});
