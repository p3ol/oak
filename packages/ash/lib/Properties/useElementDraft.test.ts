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

  it('should keep changes made to the element while editing it', () => {
    const builder = getBuilder();
    const title = builder.getElement('title');
    const { result } = renderHook(() => useElementDraft(builder, title, null));

    act(() => {
      result.current.onSettingChange('settings.className', { value: 'big' });
    });

    // Changed by someone else while the local change is pending
    builder.setElement('title', {
      content: 'Remote title',
      settings: { ...title.settings, dir: 'rtl' },
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(title.content).toBe('Remote title');
    expect(title.settings).toEqual({ dir: 'rtl', className: 'big' });
  });

  it('should merge texts changed on both sides while editing', () => {
    const builder = getBuilder();
    const title = builder.getElement('title');
    const { result, rerender } = renderHook(
      () => useElementDraft(builder, title, null)
    );

    // Local typing (pending)
    act(() => {
      result.current.onSettingChange('content', { value: 'Title (local)' });
    });

    // Someone else edits the beginning of the same text meanwhile
    act(() => {
      builder.setElement('title', { content: 'My Title' });
    });
    // The builder re-renders its panels on every content update
    rerender();

    // The draft (displayed by the field) already contains both changes
    expect(result.current.draft.content).toBe('My Title (local)');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(title.content).toBe('My Title (local)');
  });
});

