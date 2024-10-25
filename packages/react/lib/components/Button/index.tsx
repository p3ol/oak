import type { ElementObject } from '@oakjs/core';
import { type ComponentPropsWithoutRef, useContext } from 'react';
import { Button, classNames } from '@junipero/react';

import { sanitizeHTML } from '../../utils';
import { BuilderContext, type BuilderContextValue } from '../../contexts';

export interface ButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  element: ElementObject;
}

const Button_ = ({
  element,
  className,
}: ButtonProps) => {
  const { polyfills } = useContext<BuilderContextValue>(BuilderContext);

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
