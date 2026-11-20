import { $exportHtml } from './html';
import { createTestEditor } from './testUtils';

const roundTrip = (html: string) => {
  const editor = createTestEditor(html);

  return editor.read(() => $exportHtml(editor));
};

describe('html', () => {
  it('should keep the formatting supported by the toolbar', () => {
    [
      '<p>Plain <strong>bold</strong> <em>italic</em> <u>underline</u> ' +
        '<s>strike</s></p>',
      '<p><span style="color: rgb(255, 0, 0);">red</span> ' +
        '<span style="font-size: 1.4em;">big</span></p>',
      '<p><a href="https://example.com" target="_blank" ' +
        'rel="noopener noreferrer">link</a></p>',
      '<ul><li>one</li><li>two</li></ul>',
      '<ol><li>one</li><li>two</li></ol>',
      '<blockquote>quote</blockquote>',
      '<p style="text-align: center;">centered</p>',
      '<hr>',
      '<p style="padding-inline-start: 40px;">indented</p>',
    ].forEach(html => {
      expect(roundTrip(html)).toBe(html);
    });
  });

  it('should keep tables', () => {
    const html = roundTrip(
      '<table><tbody><tr><td><p>a</p></td><td><p>b</p></td></tr></tbody></table>'
    );

    expect(html).toContain('<table');
    expect(html).toContain('<td');
    expect(html).toContain('>a<');
    expect(html).toContain('>b<');
  });

  it('should wrap inline contents in paragraphs', () => {
    expect(roundTrip('Subscribe monthly')).toBe('<p>Subscribe monthly</p>');
    expect(roundTrip('Support <strong>independent</strong> journalism'))
      .toBe('<p>Support <strong>independent</strong> journalism</p>');
  });

  it('should export an empty content as an empty string', () => {
    expect(roundTrip('')).toBe('');
    expect(roundTrip('<p></p>')).toBe('');
  });

  it('should give the same html when exported again', () => {
    const html = roundTrip(
      '<p>Text with <strong><em>nested</em></strong> formats</p>'
    );

    expect(roundTrip(html)).toBe(html);
  });
});
