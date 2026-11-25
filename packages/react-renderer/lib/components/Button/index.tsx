import { type MouseEvent, useState } from 'react';
import { classNames } from '@junipero/core';

import type { RendererComponentProps } from '../../types';
import { mergeAttributes } from '../../utils';
import HTMLContent from '../HTMLContent';

const Button = ({
  element,
  attributes,
  sanitizeHTML,
  onEvent,
  dark,
}: RendererComponentProps) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const isLink = (element.action || 'link') === 'link';
  const settings = dark
    ? { ...element.settings, ...element.settings?.dark }
    : element.settings;
  const hasStateClasses = settings?.hoverClassName ||
    settings?.activeClassName;

  const onClick = (e: MouseEvent<HTMLElement>) => {
    if (isLink) {
      return;
    }

    e.preventDefault();
    onEvent?.(element.event, element);
  };

  return (
    <HTMLContent
      { ...mergeAttributes(attributes, {
        className: classNames(
          'oak:inline-flex oak:items-center oak:justify-center',
          'oak:cursor-pointer oak:no-underline',
          (element.settings?.buttonType || 'button') === 'button'
            ? classNames(
              'oak:px-5 oak:py-2 oak:rounded oak:border-0',
              dark
                ? 'oak:bg-white oak:text-[#1A1A1A]'
                : 'oak:bg-[#1A1A1A] oak:text-white',
            )
            : 'oak:underline oak:bg-transparent oak:border-0 oak:p-0',
          hovered && settings?.hoverClassName,
          active && settings?.activeClassName,
        ),
      }) }
      tag={isLink ? 'a' : 'button'}
      { ...isLink ? {
        href: element.url || undefined,
        target: element.target || undefined,
        rel: element.target === '_blank' ? 'noopener noreferrer' : undefined,
      } : { type: 'button' } }
      { ...hasStateClasses && {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => { setHovered(false); setActive(false); },
        onMouseDown: () => setActive(true),
        onMouseUp: () => setActive(false),
      } }
      onClick={onClick}
      html={element.content as string}
      sanitizeHTML={sanitizeHTML}
    />
  );
};

Button.displayName = 'ButtonRenderer';

export default Button;
