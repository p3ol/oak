import { type ElementType, type HTMLAttributes, useMemo } from 'react';

import type { SanitizeHTMLCallback } from '../types';

export declare interface HTMLContentProps extends HTMLAttributes<HTMLElement> {
  tag?: ElementType;
  html: string;
  sanitizeHTML?: SanitizeHTMLCallback;
  [key: string]: any;
}

/**
 * Renders a raw html string (usually coming from a rich text field), using
 * the given sanitizer if any.
 */
const HTMLContent = ({
  tag: Tag = 'div',
  html,
  sanitizeHTML,
  ...rest
}: HTMLContentProps) => {
  const content = useMemo(() => (
    sanitizeHTML ? sanitizeHTML(html || '') : html || ''
  ), [html, sanitizeHTML]);

  return <Tag { ...rest } dangerouslySetInnerHTML={{ __html: content }} />;
};

HTMLContent.displayName = 'HTMLContent';

export default HTMLContent;
