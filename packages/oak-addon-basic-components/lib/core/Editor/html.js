import { Node } from 'slate';
import { jsx } from 'slate-hyperscript';

const ELEMENT_TAGS = {
  A: el => ({ type: 'link', url: el.getAttribute('href') }),
  BLOCKQUOTE: () => ({ type: 'quote' }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'numbered-list' }),
  P: () => ({ type: 'paragraph' }),
  UL: () => ({ type: 'bulleted-list' }),
  DIV: el => ({ type: `text-${el.style.textAlign}` }),
};

const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  STRONG: () => ({ bold: true }),
  B: () => ({ bold: true }),
  U: () => ({ underline: true }),
  SPAN: el => ({
    color: el.style?.color,
    size: el.style?.fontSize,
  }),
};

const ALIGNMENTS = {
  'text-left': 'left',
  'text-center': 'center',
  'text-right': 'right',
  'text-justify': 'justify',
};

export const serialize = content => {
  return content.map((n, i) => {
    const children = n.children.map(e => {
      if (e.children && e.children.length) {
        return serialize([e]);
      }

      let string = Node.string(e);

      if (e.bold) string = `<b>${string}</b>`;

      if (e.underline) string = `<u>${string}</u>`;

      if (e.italic) string = `<i>${string}</i>`;

      if (e.size) {
        string = `<span style="font-size:${e.size};">${string}</span>`;
      }

      if (e.color) string = `<span style="color:${e.color};">${string}</span>`;

      return string;
    }).join('');

    if (ALIGNMENTS[n.type]) {
      return `<div style="text-align:${ALIGNMENTS[n.type]};">${children}</div>`;
    }

    return children + (i === content.length - 1 ? '' : '\n');

  }).join('');
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
  console.log({ result });
  return [{ children: result }];
};

export const isSerialized = content => {
  return typeof content === 'string';
};
