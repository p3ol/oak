import { Button, classNames } from '@junipero/react';

import { sanitizeHTML } from '../../utils';

const Button_ = ({ element, className }) => !element.content ? null : (
  <Button
    className={classNames(
      'primary !oak-pointer-events-none sanitize-html',
      className
    )}
    dangerouslySetInnerHTML={{ __html: sanitizeHTML(element.content) }}
  />
);

Button_.displayName = 'Button';

export default Button_;
