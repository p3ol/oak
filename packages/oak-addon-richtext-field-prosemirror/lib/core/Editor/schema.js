import { Schema } from 'prosemirror-model';

import { SIZES } from './utils';

export const nodes = {
  doc: {
    content: 'block+',
  },
  paragraph: {
    attrs: {
      alignment: { default: 'left' },
    },
    content: 'inline*',
    group: 'block',
    parseDOM: [
      {
        tag: 'p',
        getAttrs: node => {
          return { alignment: node.style.textAlign === 'center' ? 'center'
            : node.style.textAlign === 'right' ? 'right'
              : node.style.textAlign === 'justify' ? 'justify'
                : 'left' };
        },
      }, {
        tag: 'div',
        getAttrs: node => {
          return node.innerHTML.length === 0 ? false
            : { alignment: node.style.textAlign === 'center' ? 'center'
              : node.style.textAlign === 'right' ? 'right'
                : node.style.textAlign === 'justify' ? 'justify'
                  : 'left' };
        },
      },
    ],
    toDOM: e => {
      if (e.textContent.length === 0) {
        return ['br'];
      }

      return ['div', { style: `text-align: ${e?.attrs?.alignment}` }, 0];
    },
  },
  text: {
    group: 'inline',
    inline: true,
  },
  hardBreak: {
    group: 'block',
    selectable: false,
    parseDOM: [{
      tag: 'br',
    }, {
      tag: 'div',
      getAttrs: node => node.innerHTML.length === 0,
    }],
    toDOM () { return ['br']; },
  },
};

export const marks = {
  link: {
    spanning: true,
    attrs: {
      href: { default: null },
      target: { default: null },
    },
    parseDOM: [{
      tag: 'a[href]',
      getAttrs: dom => {
        return {
          href: dom.getAttribute('href'),
          target: dom.getAttribute('target'),
        };
      },
    }],
    toDOM: node => {
      const { href, target } = node.attrs;

      return ['a', { href, target }, 0];
    },
  },
  size: {
    attrs: {
      size: { default: `${SIZES.text}px` },
    },
    parseDOM: [
      { tag: 'span',
        getAttrs: node => {
          const size = node.style.fontSize;

          return size ? { size } : false;
        },
      }],
    toDOM: node => {
      return ['span', { style: `font-size: ${node.attrs.size}` }, 0];
    },
  },
  em: {
    parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM: () => ['span', { style: 'font-style: italic' }, 0],
  },
  strong: {
    parseDOM: [{ tag: 'strong' },
      {
        tag: 'b',
        getAttrs: node => node.style.fontWeight !== 'normal' && null,
      }, {
        style: 'font-weight',
        getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
      }],
    toDOM: () => ['span', { style: 'font-weight: bold' }, 0],
  },
  color: {
    attrs: {
      color: {
        default: '#000000',
      },
    },
    parseDOM: [{
      tag: 'span',
      getAttrs: node => {
        return { color: node.style.color };
      },
    }],
    toDOM: e => {
      return ['span', { style: `color:${e?.attrs?.color}` }, 0];
    },
  },
  underline: {
    parseDOM: [
      { tag: 'u' },
      { style: 'text-decoration=underline' },
    ],
    toDOM: () => ['span', { style: 'text-decoration: underline' }, 0],
  },
};

export const schema = new Schema({ nodes, marks });
