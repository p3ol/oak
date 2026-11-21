import { sanitizeHTML, serializeHTML } from './utils';

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
      });

      // Serialized like browsers (no xml namespaces): server-rendered canvas
      // content must match the client's
      expect(res).toBe('<p>Hello <a role="link">x</a></p>');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('should serialize nodes like browsers', () => {
    const html = '<p class="a&amp;&quot;b" data-x="1">Ceci est un ' +
      'texte&nbsp;<br>x &amp; y &lt;z&gt; <img src="i.png" alt=""></p>' +
      '<span class="p3-content-paragraph">T <b>b</b></span><!-- c -->';
    const { body } = new DOMParser().parseFromString(html, 'text/html');

    expect(serializeHTML(body.childNodes)).toBe(body.innerHTML);
  });
});
