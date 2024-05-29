import type { ElementObject } from '@oakjs/core';
import { Button, classNames } from '@junipero/react';

import { sanitizeHTML } from '../../utils';

interface ButtonProps {
  element: ElementObject;
  className?: string;
}

const Button_ = ({
  element,
  className,
}: ButtonProps) => !element.content ? null : (
  <Button
    className={classNames(
      'default !oak-pointer-events-none sanitize-html',
      className
    )}
    dangerouslySetInnerHTML={
      { __html: sanitizeHTML(element.content as string) }
    }
  />
);

Button_.displayName = 'Button';

export default Button_;
