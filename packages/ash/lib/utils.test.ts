import { sanitizeHTML } from './utils';

describe('sanitizeHTML', () => {
  const html = '<p>Hello <a href="https://x.test" target="_blank">x</a></p>' +
    '<script>alert(1)</script>';

  it('should remove scripts & disable links', () => {
    expect(sanitizeHTML(html))
      .toBe('<p>Hello <a role="link">x</a></p>');
  });

  it('should prefer the native parser over polyfills', () => {
    // Parses as xml: documents without `body`, like @xmldom/xmldom's
    class XmlParser {
      parseFromString (str: string) {
        return new DOMParser().parseFromString(str, 'application/xml');
      }
    }

    expect(sanitizeHTML(html, { parser: XmlParser as any }))
      .toBe('<p>Hello <a role="link">x</a></p>');
  });

  it('should use polyfills outside of browsers', () => {
    const NativeParser = globalThis.DOMParser;

    class XmlParser {
      parseFromString (str: string) {
        return new NativeParser().parseFromString(str, 'application/xml');
      }
    }

    vi.stubGlobal('DOMParser', undefined);

    try {
      const res = sanitizeHTML('<p>Hello <a href="x">x</a></p>', {
        parser: XmlParser as any,
        serializer: XMLSerializer,
      });

      expect(res).toContain('<p');
      expect(res).toContain('Hello');
      expect(res).toContain('role="link"');
      expect(res).not.toContain('href');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
