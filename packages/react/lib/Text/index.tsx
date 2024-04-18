import { ComponentPropsWithoutRef, ReactNode } from 'react';

import { useBuilder } from '../hooks';
import { GetTextCallback } from '../../../core/lib/types';

export declare interface TextProps extends ComponentPropsWithoutRef<any> {
  children?: ReactNode | JSX.Element | GetTextCallback;
  name?: string;
  default?: ReactNode | JSX.Element | GetTextCallback;
}

const Text = ({
  children,
  name,
  default: def,
}: TextProps) => {
  const { builder } = useBuilder();
  const handler = name || children;

  return typeof handler === 'function'
    ? handler(builder?.getText.bind(builder))
    : builder?.getText?.(handler, def || children || null) || def || null;
};

Text.displayName = 'Text';

export default Text;
