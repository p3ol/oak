import {
  applyTextChange,
  getTextChange,
  mapTextPosition,
  mergeText,
} from './textChanges';

describe('textChanges', () => {
  it('should find the changed range between two texts', () => {
    expect(getTextChange('hello', 'hello')).toBeNull();
    expect(getTextChange('hello', 'help')).toEqual({
      start: 3, end: 5, insert: 'p',
    });
    expect(getTextChange('abc', 'abxc')).toEqual({
      start: 2, end: 2, insert: 'x',
    });
    expect(getTextChange('abc', 'ac')).toEqual({
      start: 1, end: 2, insert: '',
    });
  });

  it('should apply a change', () => {
    const a = 'Subscribe monthly';
    const b = 'Subscribe yearly now';

    expect(applyTextChange(a, getTextChange(a, b))).toBe(b);
    expect(applyTextChange(a, null)).toBe(a);
  });

  it('should merge concurrent changes made at different places', () => {
    expect(mergeText('Click here', 'Please click here', 'Click here now'))
      .toBe('Please click here now');
    expect(mergeText('Click here', 'Click here now', 'Please click here'))
      .toBe('Please click here now');
    expect(mergeText('abc', 'abc', 'abcd')).toBe('abcd');
    expect(mergeText('abc', 'xabc', 'abc')).toBe('xabc');
  });

  it('should keep the local change when changes overlap', () => {
    expect(mergeText('Click here', 'Tap here', 'Press here')).toBe('Tap here');
  });

  it('should map a position across a change', () => {
    // Before the change
    expect(mapTextPosition(2, 'Click here', 'Click here now')).toBe(2);
    // After the change
    expect(mapTextPosition(5, 'Click here', 'Please click here')).toBe(12);
    // Inside a replaced range: end of the inserted text
    expect(mapTextPosition(3, 'Click here', 'Tap here')).toBe(3);
    expect(mapTextPosition(4, 'abcdef', 'af')).toBe(1);
  });
});
