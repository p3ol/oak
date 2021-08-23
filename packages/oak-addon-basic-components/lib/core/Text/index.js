import { useBuilder } from '@poool/oak';

import settings from './index.settings';

const Text = ({ element, className }) => {
  const { getOverrides } = useBuilder();
  const overrides = getOverrides('component', 'text');
  const props = overrides.render ? {
    children: overrides.render(element),
  } : {
    dangerouslySetInnerHTML: { __html: element.content },
  };

  return (
    <div
      { ...props }
      className={className}
    />
  );
};

Text.settings = settings;

export default Text;
