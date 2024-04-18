import { classNames } from '@junipero/react';
import { ComponentPropsWithoutRef } from 'react';

import { sanitizeHTML } from '../../utils';
import { ElementObject } from '../../../../core/lib/types';

declare interface TextProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

const Text = ({ element, className }: TextProps) => !element.content ? null : (
  <div
    className={classNames('junipero sanitize-html', className)}
    dangerouslySetInnerHTML={{ __html: sanitizeHTML(element.content) }}
  />
);

Text.displayName = 'TextComponent';

export default Text;
