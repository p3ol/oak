import type { AddonObject, FieldObject } from '@oakjs/core';
import { omit } from '@junipero/react';
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

/**
 * Works with every oak builder (`@oakjs/react`, `@oakjs/ash`)
 */
export declare interface RemirrorFieldObject extends FieldObject {
  render: typeof Field;
}

export const remirrorField = ({
  extensions,
  ...props
}: RemirrorFieldProps = {}): RemirrorFieldObject => ({
  type: 'remirror',
  render: Field,
  ...omit(props, ['onChange']),
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

export const remirrorFieldAddon = (
  props?: RemirrorFieldProps,
): AddonObject => ({
  fields: [remirrorField({
    extensions: basicExtensions,
    ...props,
  })],
});
