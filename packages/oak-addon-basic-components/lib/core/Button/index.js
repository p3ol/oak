import { useBuilder } from '@poool/oak';

import settings from './index.settings';

const Button = ({ element, className }) => {
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

Button.settings = settings;

export default Button;
