import { classNames } from '@junipero/react';

import { sanitizeHTML } from '../../utils';

const Title = ({ element, className }) => {
  const Tag = element.headingLevel || 'h1';
  const sizes = {
    h1: '!oak-text-4xl',
    h2: '!oak-text-3xl',
    h3: '!oak-text-2xl',
    h4: '!oak-text-xl',
    h5: '!oak-text-lg',
    h6: '!oak-text-md',
  };

  if (!element.content) return null;

  return (
    <Tag
      className={classNames(
        'junipero oak-m-0 sanitize-html',
        sizes[Tag],
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitizeHTML(element.content) }}
    />
  );
};

Title.displayName = 'Title';

export default Title;
