import type { ComponentPropsWithoutRef } from 'react';
import type { ElementObject } from '@oakjs/core';
import { Button, classNames } from '@junipero/react';

import { sanitizeHTML } from '../../utils';
import { useBuilder } from '../../hooks';

export interface ButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  element: ElementObject;
}

const Button_ = ({
  element,
  className,
}: ButtonProps) => {
  const { polyfills } = useBuilder();

  if (!element.content) {
    return null;
  }

  return (
    <Button
      className={classNames(
        'default !oak-pointer-events-none sanitize-html',
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

Button_.displayName = 'Button';

export default Button_;
