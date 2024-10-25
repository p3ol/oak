export const copyToClipboard = (value: string) =>
  globalThis.navigator.clipboard.writeText(value);

export const sanitizeHTML = (content: string, opts?: {
  parser?: typeof DOMParser;
  serializer?: typeof XMLSerializer;
}) => {
  try {
    const parsed = new (opts?.parser || DOMParser)()
      .parseFromString(content, 'text/html');

    // Remove script & style tags
    ['script', 'style', 'iframe', 'object', 'video', 'audio'].forEach(t => {
      Array.from(parsed.getElementsByTagName(t))
        .forEach(item => item.parentNode.removeChild(item));
    });

    // Disable all links
    Array.from(parsed.getElementsByTagName('a')).forEach(item => {
      if (item.hasAttribute('href')) {
        item.removeAttribute('href');
        item.removeAttribute('target');
        item.setAttribute('role', 'link');
      }
    });

    return new (opts?.serializer || XMLSerializer)().serializeToString(parsed);
  } catch (e) {
    console.error(e);

    return '';
  }
};
