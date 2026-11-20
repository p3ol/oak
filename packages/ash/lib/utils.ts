export const copyToClipboard = (value: string) =>
  globalThis.navigator?.clipboard?.writeText(value);

export const readClipboard = async (): Promise<string | null> => {
  try {
    return await globalThis.navigator.clipboard.readText();
  } catch {
    return null;
  }
};

const getElements = (doc: Document, tagName: string) =>
  Array.from(doc.getElementsByTagName(tagName) || []);

/**
 * Sanitizes html content displayed inside the builder canvas: removes
 * scripts & embeds, and disables links so they cannot be followed while
 * editing.
 *
 * Uses the browser's DOMParser when available: `parser` & `serializer`
 * (e.g. @xmldom/xmldom) are only used outside of browsers.
 */
export const sanitizeHTML = (content: string, opts?: {
  parser?: typeof DOMParser;
  serializer?: typeof XMLSerializer;
}) => {
  try {
    const Parser = typeof DOMParser !== 'undefined' ? DOMParser : opts?.parser;
    const parsed = new Parser()
      .parseFromString(`<body>${content}</body>`, 'text/html');

    ['script', 'style', 'iframe', 'object', 'embed', 'video', 'audio']
      .forEach(t => {
        getElements(parsed, t).forEach(item => item.parentNode?.removeChild(item));
      });

    getElements(parsed, 'a').forEach(item => {
      if (item.hasAttribute('href')) {
        item.removeAttribute('href');
        item.removeAttribute('target');
        item.setAttribute('role', 'link');
      }
    });

    // Html documents (browsers)
    if (parsed.body) {
      return parsed.body.innerHTML;
    }

    // Polyfilled parsers (e.g. @xmldom/xmldom) may return documents without
    // `body` nor `innerHTML`: serialize the body's children instead
    const body = getElements(parsed, 'body')[0];
    const Serializer = typeof XMLSerializer !== 'undefined'
      ? XMLSerializer : opts?.serializer;
    const serializer = new Serializer();

    return Array.from(body?.childNodes || [])
      .map(node => serializer.serializeToString(node))
      .join('');
  } catch (e) {
    console.error(e);

    return '';
  }
};

/**
 * Returns true if the event target is a field where the user is typing, so
 * that keyboard shortcuts don't interfere with it.
 */
export const isTypingTarget = (target: EventTarget | null) => {
  const el = target as HTMLElement;

  return !!el && (
    el.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)
  );
};
