import { getChangedPaths, getUpdates } from './diff';

describe('diff', () => {
  it('should find changed paths', () => {
    expect(getChangedPaths(
      { a: 1, b: { c: 1, d: [1] }, e: 'x' },
      { a: 1, b: { c: 2, d: [1, 2] }, f: true },
    )).toEqual([['b', 'c'], ['b', 'd'], ['e'], ['f']]);

    // Added objects only return their own values
    expect(getChangedPaths({}, { settings: { size: 6 } }))
      .toEqual([['settings', 'size']]);
  });

  it('should build updates keeping unchanged nested values', () => {
    const target = { settings: { size: 6, gap: '10px' }, content: 'Old' };
    const next = { settings: { size: 12, gap: '0px' }, content: 'New' };

    expect(getUpdates(target, next, [['settings', 'size'], ['content']]))
      .toEqual({ settings: { size: 12, gap: '10px' }, content: 'New' });
  });
});
