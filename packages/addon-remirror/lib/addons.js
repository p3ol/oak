import {
  BoldExtension,
  FontSizeExtension,
  ItalicExtension,
  UnderlineExtension,
  LinkExtension,
  TextColorExtension,
  NodeFormattingExtension,
} from 'remirror/extensions';

import Field from './Field';

export const remirrorField = ({ extensions, ...props } = {}) => ({
  type: 'remirror',
  render: Field,
  ...props,
  props: {
    extensions,
  },
});

export const basicExtensions = () => [
  new BoldExtension(),
  new ItalicExtension(),
  new UnderlineExtension(),
  new LinkExtension(),
  new TextColorExtension(),
  new FontSizeExtension(),
  new NodeFormattingExtension(),
];

export const remirrorFieldAddon = props => ({
  fields: [remirrorField({
    extensions: basicExtensions,
    ...props,
  })],
});
