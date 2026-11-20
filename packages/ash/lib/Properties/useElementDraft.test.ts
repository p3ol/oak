import { Builder, type ElementObject } from '@oakjs/core';
import { act, renderHook } from '@testing-library/react';

import { baseAddon } from '../addons';
import { useElementDraft } from './useElementDraft';

const getBuilder = () => new Builder({
  addons: [baseAddon() as any],
  content: [
    { id: 'row', type: 'row', cols: [{ id: 'col', type: 'col', content: [] }] },
    { id: 'title', type: 'title', content: 'Title' },
  ],
});

describe('useElementDraft', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not commit anything when switching element without changes', () => {
    const builder = getBuilder();
    const col = builder.getElement('col', { deep: true });
    const title = builder.getElement('title');
    const { rerender } = renderHook(
      ({ element }) => useElementDraft(builder, element, null),
      { initialProps: { element: col } },
    );

    builder.addElement({ type: 'text', content: 'Child' }, {
      parent: col.content as ElementObject[],
    });
    rerender({ element: title });

    expect((col.content as ElementObject[]).map(e => e.type))
      .toEqual(['text']);
  });

  it('should commit setting changes without overwriting children', () => {
    const builder = getBuilder();
    const col = builder.getElement('col', { deep: true });
    const { result } = renderHook(() => useElementDraft(builder, col, null));

    act(() => {
      result.current.onSettingChange('size', { value: 6 });
    });

    // Children added while the change is pending
    builder.addElement({ type: 'text', content: 'Child' }, {
      parent: col.content as ElementObject[],
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(col.size).toBe(6);
    expect((col.content as ElementObject[]).length).toBe(1);
  });
});
