import type { AddonObject, ReactFieldObject } from '@oakjs/react';
import {
  BoldExtension,
  FontSizeExtension,
  ItalicExtension,
  UnderlineExtension,
  LinkExtension,
  TextColorExtension,
  NodeFormattingExtension,
} from 'remirror/extensions';

import type { Extensions } from './types';
import Field, { type RemirrorFieldProps } from './Field';

export const remirrorField = ({
  extensions,
  ...props
}: RemirrorFieldProps = {}): ReactFieldObject => ({
  type: 'remirror',
  render: Field,
  ...props,
  props: {
    extensions,
  },
});

export const basicExtensions = (): Extensions[] => [
  new BoldExtension({}),
  new ItalicExtension(),
  new UnderlineExtension(),
  new LinkExtension({}),
  new TextColorExtension({}),
  new FontSizeExtension({
    defaultSize: '16px',
    unit: 'px',
  }),
  new NodeFormattingExtension({}),
];

export const remirrorFieldAddon = (props?: ReactFieldObject): AddonObject => ({
  fields: [remirrorField({
    extensions: basicExtensions,
    ...props,
  })],
});
