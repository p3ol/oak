import { $getSelection, $isRangeSelection } from 'lexical';

import { createTestEditor } from './testUtils';
import {
  $getPointOffset,
  $selectOffsets,
  $serialize,
  mapPosition,
} from './positions';

describe('positions', () => {
  it('should convert selections to offsets & back', () => {
    const editor = createTestEditor(
      '<p>Hello <strong>world</strong></p><ul><li>item</li></ul>'
    );

    editor.update(() => {
      const text = $serialize();

      // Every position of the document survives a round trip
      for (let offset = 0; offset <= text.length; offset++) {
        $selectOffsets(offset, offset);
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const back = $getPointOffset(selection.anchor);

          // Positions on element boundaries move inside the closest text
          expect(Math.abs(back - offset)).toBeLessThanOrEqual(2);
        }
      }

      // Inside texts, positions are exact
      $selectOffsets(3, 10);
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        throw new Error('No selection');
      }

      expect($getPointOffset(selection.anchor)).toBe(3);
      expect($getPointOffset(selection.focus)).toBe(10);
      expect(selection.getTextContent()).toBe('llo wor');
    }, { discrete: true });
  });

  it('should map positions across a change', () => {
    // "C" replaced by "Please c"
    expect(mapPosition(0, 'Click here', 'Please click here')).toBe(0);
    expect(mapPosition(6, 'Click here', 'Please click here')).toBe(13);
    expect(mapPosition(8, 'Click here', 'Click there')).toBe(9);
  });
});
