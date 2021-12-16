export const filterOverride = (type, o, item) => {
  switch (type) {
    case 'component':
      return o.components.includes(item);
    case 'field':
      return o.fields.includes(item);
    default:
      return false;
  }
};

export const sanitizeHTML = content => {
  try {
    const parsed = new DOMParser().parseFromString(content, 'text/html');

    // Remove script & style tags
    parsed.querySelectorAll('script, style').forEach(item => {
      item.parentNode.removeChild(item);
    });

    // Disable all links
    parsed.querySelectorAll('a[href]').forEach(item => {
      item.removeAttribute('href');
      item.removeAttribute('_target');
      item.setAttribute('role', 'link');
    });

    return parsed.body.innerHTML;
  } catch (e) {
    console.error(e);

    return '';
  }
};
