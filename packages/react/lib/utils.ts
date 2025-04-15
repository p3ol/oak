export const copyToClipboard = (value: string) =>
  globalThis.navigator.clipboard.writeText(value);

const getElements = (doc: Document, tagName: string) => {
  return Array.from(doc.getElementsByTagName(tagName) || []);
};

export const sanitizeHTML = (content: string, opts?: {
  parser?: typeof DOMParser;
  serializer?: typeof XMLSerializer;
}) => {
  try {
    const parsed = new (opts?.parser || DOMParser)()
      .parseFromString(`<body>${content}</body>`, 'text/html');

    // Remove script & style tags
    ['script', 'style', 'iframe', 'object', 'video', 'audio'].forEach(t => {
      getElements(parsed, t).forEach(item => {
        if (item.parentNode) {
          item.parentNode.removeChild(item);
        }
      });
    });

    // Disable all links
    getElements(parsed, 'a').forEach(item => {
      if (item.hasAttribute('href')) {
        item.removeAttribute('href');
        item.removeAttribute('target');
        item.setAttribute('role', 'link');
      }
    });

    return new (opts?.serializer || XMLSerializer)()
      .serializeToString(parsed)
      .replace(/\sxmlns="[^"]*"/g, '');
  } catch (e) {
    console.error(e);

    return '';
  }
};
