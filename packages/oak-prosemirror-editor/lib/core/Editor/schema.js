import { Schema } from 'prosemirror-model';

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
    parseDOM: [{
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
    }, {
      tag: 'br',
    },
    ],
    toDOM: e => {
      return ['div', { style: `text-align: ${e?.attrs?.alignment}` }, 0];
    },
  },

  text: {
    group: 'inline',
  },

  hard_break: {
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
    attrs: {
      href: {},
      title: { default: null },
    },
    inclusive: false,
    parseDOM: [{
      tag: 'a[href]',
      getAttrs: dom => {
        return {
          href: dom.getAttribute('href'),
          title: dom.getAttribute('title'),
        };
      },
    }],
    toDOM (node) {
      const { href, title } = node.attrs;

      return ['a', { href, title }, 0];
    },
  },

  size: {
    attrs: {
      size: { },
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
  underline: {
    parseDOM: [
      { tag: 'u' },
      { style: 'text-decoration=underline' },
    ],
    toDOM: () => ['span', { style: 'text-decoration: underline' }, 0],
  },

  em: {
    parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM: () => ['em', 0],
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
    toDOM: () => ['strong', 0],
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
};

export const schema = new Schema({ nodes, marks });
