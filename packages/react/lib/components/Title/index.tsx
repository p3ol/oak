import type { ElementObject } from '@oakjs/core';
import {
  type SpecialComponentPropsWithoutRef,
  classNames,
} from '@junipero/react';

import { sanitizeHTML } from '../../utils';
import { useBuilder } from '../../hooks';

export interface TitleProps extends SpecialComponentPropsWithoutRef {
  element: ElementObject;
}

const Title = ({ element, className }: TitleProps) => {
  const { polyfills } = useBuilder();

  const Tag = element.headingLevel || 'h1';
  const sizes: { [key: string]: string } = {
    h1: '!oak-text-4xl',
    h2: '!oak-text-3xl',
    h3: '!oak-text-2xl',
    h4: '!oak-text-xl',
    h5: '!oak-text-lg',
    h6: '!oak-text-md',
  };

  if (!element.content) {
    return null;
  }

  return (
    <Tag
      className={classNames(
        'junipero oak-m-0 sanitize-html',
        sizes[Tag],
        className
      )}
      dangerouslySetInnerHTML={
        { __html: sanitizeHTML(element.content as string, {
          parser: polyfills?.DOMParser,
          serializer: polyfills?.XMLSerializer,
        }) }
      }
    />
  );
};

Title.displayName = 'Title';

export default Title;
