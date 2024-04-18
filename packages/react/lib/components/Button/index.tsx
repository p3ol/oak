import { Button, classNames } from '@junipero/react';

import { sanitizeHTML } from '../../utils';
import { ElementObject } from '../../../../core/lib/types';

const Button_ = (
  { element, className }: { element: ElementObject, className: string }
) => !element.content ? null : (
  <Button
    className={classNames(
      'default !oak-pointer-events-none sanitize-html',
      className
    )}
    dangerouslySetInnerHTML={{ __html: sanitizeHTML(element.content) }}
  />
);

Button_.displayName = 'Button';

export default Button_;
