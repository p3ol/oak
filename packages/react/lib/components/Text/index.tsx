import type { ComponentPropsWithoutRef } from 'react';
import type { ElementObject } from '@oakjs/core';
import { classNames } from '@junipero/react';

import { sanitizeHTML } from '../../utils';

export interface TextComponentProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

const Text = ({
  element,
  className,
}: TextComponentProps) => !element.content ? null : (
  <div
    className={classNames('junipero sanitize-html', className)}
    dangerouslySetInnerHTML={
      { __html: sanitizeHTML(element.content as string) }
    }
  />
);

Text.displayName = 'TextComponent';

export default Text;
