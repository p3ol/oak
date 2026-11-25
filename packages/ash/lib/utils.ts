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

// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'source', 'track', 'wbr',
]);

const escapeText = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/\u00a0/g, '&nbsp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const escapeAttribute = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/\u00a0/g, '&nbsp;')
  .replace(/"/g, '&quot;');

/**
 * Serializes nodes like browsers' `innerHTML` (html fragment serialization
 * algorithm), whatever the dom implementation: xml serializers (e.g.
 * @xmldom/xmldom's) add namespaces, self-close void elements and don't
 * escape non-breaking spaces, which would not match the browser's html
 * (e.g. when hydrating server-rendered content).
 */
export const serializeHTML = (nodes: ArrayLike<Node>): string => Array
  .from(nodes || [])
  .map(node => {
    switch (node.nodeType) {
      case 1: {
        const element = node as Element;
        const tag = (element.localName || element.nodeName).toLowerCase();
        const attributes = Array.from(element.attributes || [])
          .filter(attr => attr.name !== 'xmlns' && !attr.name.startsWith('xmlns:'))
          .map(attr => ` ${attr.name}="${escapeAttribute(attr.value)}"`)
          .join('');

        return VOID_ELEMENTS.has(tag)
          ? `<${tag}${attributes}>`
          : `<${tag}${attributes}>${serializeHTML(element.childNodes)}</${tag}>`;
      }
      case 3:
        return escapeText(node.nodeValue || '');
      case 8:
        return `<!--${node.nodeValue || ''}-->`;
      default:
        return '';
    }
  })
  .join('');

/**
 * Sanitizes html content displayed inside the builder canvas: removes
 * scripts & embeds, and disables links so they cannot be followed while
 * editing.
 *
 * Uses the browser's DOMParser when available: `parser` (e.g.
 * @xmldom/xmldom) is only used outside of browsers, and its result is
 * serialized like the browser's (see `serializeHTML`).
 */
export const sanitizeHTML = (content: string, opts?: {
  parser?: typeof DOMParser;
  /**
   * @deprecated Not used anymore: content is serialized like browsers do
   */
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
    // `body` nor `innerHTML`: serialize the body's children instead, the same
    // way browsers do
    return serializeHTML(getElements(parsed, 'body')[0]?.childNodes || []);
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
