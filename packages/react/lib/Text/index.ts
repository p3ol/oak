import type { FC, ReactNode } from 'react';

import { useBuilder } from '../hooks';

interface TextProps {
  children?: ReactNode;
  name?: string;
  default?: ReactNode;
}

const Text: FC<TextProps> = ({
  children,
  name,
  default: def,
}) => {
  const { builder } = useBuilder();
  const handler = name || children;

  return typeof handler === 'function'
    ? (handler as Function)(builder.getText.bind(builder))
    : builder.getText?.(
      handler as string, (def || children || null) as string) || def || null;
};

Text.displayName = 'Text';

export default Text;
