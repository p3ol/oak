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
 */
export const sanitizeHTML = (content: string, opts?: {
  parser?: typeof DOMParser;
  serializer?: typeof XMLSerializer;
}) => {
  try {
    const parsed = new (opts?.parser || DOMParser)()
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

    return parsed.body.innerHTML;
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
