import { classNames } from '@junipero/react';

import { sanitizeHTML } from '../../utils';

const Text = ({ element, className }) => !element.content ? null : (
  <div
    className={classNames('junipero', className)}
    dangerouslySetInnerHTML={{ __html: sanitizeHTML(element.content) }}
  />
);

Text.displayName = 'TextComponent';

export default Text;
