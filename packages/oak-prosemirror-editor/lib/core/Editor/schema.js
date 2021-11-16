import { Schema } from 'prosemirror-model';

const brDOM = ['br'];
const uDOM = ['u', 0];
const emDOM = ['em', 0];
const strongDOM = ['strong', 0];
const codeDOM = ['code', 0];

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
      return e.content.size === 0 ? ['br']
        : ['div', { style: `text-align: ${e?.attrs?.alignment}` }, 0];
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
    toDOM () { return brDOM; },
  },
};

export const marks = {
  link: {
    attrs: {
      href: {},
      title: { default: null },
    },
    inclusive: false,
    parseDOM: [{ tag: 'a[href]', getAttrs (dom) {
      return {
        href: dom.getAttribute('href'),
        title: dom.getAttribute('title'),
      };
    } }],
    toDOM (node) {
      const { href, title } = node.attrs;

      return ['a', { href, title }, 0];
    },
  },

  em: {
    parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM () { return emDOM; },
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
    toDOM () { return strongDOM; },
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

  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM () { return codeDOM; },
  },

  underline: {
    parseDOM: [{ tag: 'u' }, { style: 'font-style=underline' }],
    toDOM: () => uDOM,
  },
};

export const schema = new Schema({ nodes, marks });
