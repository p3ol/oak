import { useBuilder } from '@poool/oak';

import settings from './index.settings';

const Title = ({ element, className }) => {
  const { getOverrides } = useBuilder();
  const Tag = element.headingLevel || 'h1';
  const overrides = getOverrides('component', 'title');
  const props = overrides?.render ? {
    children: overrides.render(element),
  } : {
    dangerouslySetInnerHTML: { __html: element.content },
  };

  return (
    <Tag
      { ...props }
      className={className}
    />
  );
};

Title.settings = settings;

export default Title;
