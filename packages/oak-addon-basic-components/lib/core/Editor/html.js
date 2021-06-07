import { Node } from 'slate';
import { jsx } from 'slate-hyperscript';

const ELEMENT_TAGS = {
  A: el => ({ type: 'link', url: el.getAttribute('href') }),
  BLOCKQUOTE: () => ({ type: 'quote' }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'numbered-list' }),
  P: () => ({ type: 'paragraph' }),
  UL: () => ({ type: 'bulleted-list' }),
};

const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  STRONG: () => ({ bold: true }),
  B: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

export const serialize = content => {
  return content.map(n => {
    return n.children.map(e => {
      let string = Node.string(e);

      if (e.bold) string = `<b>${string}</b>`;

      if (e.underline) string = `<u>${string}</u>`;

      if (e.italic) string = `<i>${string}</i>`;

      return string;
    }).join('');

  }).join('\n');
};

export const deserializeNode = el => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  const { nodeName } = el;
  const parent = el;

  const children = Array.from(parent.childNodes)
    .map(deserializeNode)
    .flat();

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);

    return jsx('element', attrs, children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);

    return children.map(child => jsx('text', attrs, child));
  }

  return children;
};

export const deserialize = content => {
  if (!content) {
    return [{ children: [{ text: '' }] }];
  }

  const parsed = new DOMParser().parseFromString(content, 'text/html');
  const result = deserializeNode(parsed.body);

  return [{ children: result }];
};

export const isSerialized = content => {
  return typeof content === 'string';
};
