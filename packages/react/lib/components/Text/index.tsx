import { type ComponentPropsWithoutRef, useContext } from 'react';
import type { ElementObject } from '@oakjs/core';
import { classNames } from '@junipero/react';

import { sanitizeHTML } from '../../utils';
import { BuilderContext, type BuilderContextValue } from '../../contexts';

export interface TextComponentProps extends ComponentPropsWithoutRef<'div'> {
  element: ElementObject;
}

const Text = ({
  element,
  className,
}: TextComponentProps) => {
  const { polyfills } = useContext<BuilderContextValue>(BuilderContext);

  if (!element.content) {
    return null;
  }

  return (
    <div
      className={classNames('junipero sanitize-html', className)}
      dangerouslySetInnerHTML={
        { __html: sanitizeHTML(element.content as string, {
          parser: polyfills?.DOMParser,
          serializer: polyfills?.XMLSerializer,
        }) }
      }
    />
  );
};

Text.displayName = 'TextComponent';

export default Text;
