import type { AddonObject, FieldObject } from '@oakjs/core';
import { omit } from '@junipero/react';

import Field, { type LexicalFieldProps } from './Field';

/**
 * Works with every oak builder (`@oakjs/react`, `@oakjs/ash`)
 */
export declare interface LexicalFieldObject extends FieldObject {
  render: typeof Field;
}

export declare type LexicalFieldAddonProps = Pick<
  LexicalFieldProps, 'toolbar' | 'fontSizes'
> & Partial<Omit<FieldObject, 'render' | 'props'>>;

export const lexicalField = ({
  toolbar,
  fontSizes,
  ...props
}: LexicalFieldAddonProps = {}): LexicalFieldObject => ({
  type: 'lexical',
  render: Field,
  ...omit(props, ['onChange']),
  props: {
    ...toolbar && { toolbar },
    ...fontSizes && { fontSizes },
  },
});

export const lexicalFieldAddon = (
  props?: LexicalFieldAddonProps,
): AddonObject => ({
  fields: [lexicalField(props)],
});
