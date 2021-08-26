import { Node, Text } from 'slate';
import { jsx } from 'slate-hyperscript';

const ELEMENT_TAGS = {
  A: el => ({
    type: 'link',
    url: el.getAttribute('href'),
    target: el.getAttribute('target'),
  }),
  BLOCKQUOTE: () => ({ type: 'quote' }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'numbered-list' }),
  P: () => ({ type: 'paragraph' }),
  UL: () => ({ type: 'bulleted-list' }),
  DIV: el => el.style.textAlign
    ? ({ type: `text-${el.style.textAlign}` })
    : null,
};

const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  STRONG: () => ({ bold: true }),
  B: () => ({ bold: true }),
  U: () => ({ underline: true }),
  A: ({ href, target }) => ({ link: href, target }),
  SPAN: ({ style = {} }) => ({
    ...(style.color ? { color: style.color } : {}),
    ...(style.fontSize ? { size: style.fontSize } : {}),
    ...(style.fontWeight ? { bold: style.fontWeight === 'bold' } : {}),
    ...(style.fontStyle ? { italic: style.fontStyle === 'italic' } : {}),
    ...(style.textDecoration ? {
      underline: style?.textDecoration === 'underline',
    } : {}),
  }),
};

const ALIGNMENTS = {
  'text-center': 'center',
  'text-right': 'right',
  'text-justify': 'justify',
};

export const serialize = (node = []) => {
  if (isSerialized(node)) {
    return node;
  }

  if (Array.isArray(node)) {
    return node
      .map((n, i) =>
        serialize(n) +
        (n.children && i !== node.length - 1 ? '<br />' : '')
      )
      .join('');
  }

  if (Text.isText(node)) {
    const string = Node.string(node).replace('\n', '<br />');
    let styles = '';

    if (node.bold) styles += 'font-weight:bold;';

    if (node.underline) styles += 'text-decoration:underline;';

    if (node.italic) styles += 'font-style:italic;';

    if (node.size) styles += `font-size:${node.size};`;

    if (node.color) styles += `color:${node.color};`;

    let res = '';

    if (styles.length > 0) {
      styles = ` style="${styles}"`;

      res = `<span${styles}>${string}</span>`;
    } else {
      res = string;
    }

    return res;
  }

  const children = node.children?.map(n => serialize(n)).join('');

  switch (node.type) {
    case 'text-center':
    case 'text-right':
    case 'text-justify':
      return `<div style="text-align:${ALIGNMENTS[node.type]};">` +
        `${children}</div>`;
    case 'quote':
      return `<blockquote><p>${children}</p></blockquote>`;
    case 'paragraph':
      return `<div>${children}</div>`;
    case 'link': {
      const target =
        node.target && node.target !== '' ? 'target="' + node.target + '"' : '';

      return `<a ${target} href="${node.url}" >${children}</a>`;
    }
    default:
      return children;
  }
};

export const deserializeNode = el => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  if (el.childNodes.length === 0) {
    return [jsx('text', null, '')];
  }

  const children = Array.from(el.childNodes)
    .map(deserializeNode);

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[el.nodeName]) {
    const attrs = ELEMENT_TAGS[el.nodeName](el);

    return jsx('element', attrs, children);
  }

  if (TEXT_TAGS[el.nodeName]) {
    const attrs = TEXT_TAGS[el.nodeName](el);

    return children.map(child => jsx('text', attrs, child));
  }

  return children;
};

export const deserialize = content => {
  if (!content || typeof content === 'function') {
    return [{ children: [{ text: '' }] }];
  }

  if (!isSerialized(content)) {
    return content;
  }

  const parsed = new DOMParser().parseFromString(content, 'text/html');
  const result = deserializeNode(parsed.body);

  return [{ children: result }];
};

export const isSerialized = content => {
  return typeof content === 'string' || typeof content === 'function';
};
