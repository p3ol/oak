export const copyToClipboard = (value: string) =>
  globalThis.navigator.clipboard.writeText(value);

export const sanitizeHTML = (content: string) => {
  try {
    const parsed = new DOMParser().parseFromString(content, 'text/html');

    // Remove script & style tags
    parsed
      .querySelectorAll('script, style, iframe, object, video, audio')
      .forEach(item => item.parentNode.removeChild(item));

    // Disable all links
    parsed.querySelectorAll('a[href]').forEach(item => {
      item.removeAttribute('href');
      item.removeAttribute('target');
      item.setAttribute('role', 'link');
    });

    return parsed.body.innerHTML;
  } catch (e) {
    console.error(e);

    return '';
  }
};

export function assignDefined<T extends any> (
  target: T,
  ...sources: Array<any>
): T {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    for (const key in source) {
      if (typeof source[key] !== 'undefined') {
        // @ts-ignore it's obviously any
        target[key] = source[key];
      }
    }
  }

  return target;
}
