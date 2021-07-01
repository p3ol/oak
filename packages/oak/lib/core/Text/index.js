import { useBuilder } from '../../hooks';

export default ({
  children,
  name,
  default: def,
}) => {
  const { getText } = useBuilder();
  const handler = name || children;

  return typeof handler === 'function'
    ? handler(getText) : getText(handler, def || handler || null);
};
