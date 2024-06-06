import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { GetTextCallback } from '@oakjs/core';

import { useBuilder } from '../hooks';

export interface TextProps extends ComponentPropsWithoutRef<any> {
  children?: ReactNode | GetTextCallback;
  name?: string | GetTextCallback;
  default?: ReactNode;
}

const Text = ({
  children,
  name,
  default: def,
}: TextProps) => {
  const { builder } = useBuilder();
  const handler = name || children;

  return typeof handler === 'function'
    ? (handler as Function)(builder.getText.bind(builder))
    : builder.getText?.(
      handler as string, (def || children || null) as string) || def || null;
};

Text.displayName = 'Text';

export default Text;
