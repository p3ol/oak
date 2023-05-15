import { useBuilder } from '../hooks';

const Text = ({
  children,
  name,
  default: def,
}) => {
  const { builder } = useBuilder();
  const handler = name || children;

  return typeof handler === 'function'
    ? handler(builder.getText.bind(builder))
    : builder.getText?.(handler, def || children || null) || def || null;
};

Text.displayName = 'Text';

export default Text;
