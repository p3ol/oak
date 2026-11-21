import type { MouseEvent } from 'react';

import type { RendererComponentProps } from '../../types';
import { containerAttributes, mergeAttributes } from '../../utils';

const Clickable = ({
  element,
  attributes,
  renderContainer,
  onEvent,
}: RendererComponentProps) => {
  const isLink = (element.action || 'link') === 'link';
  const children = renderContainer('content');
  const attrs = {
    ...mergeAttributes(attributes, {
      className: 'oak:block oak:cursor-pointer oak:no-underline',
      style: { color: 'inherit' },
    }),
    ...containerAttributes('content'),
  };

  if (isLink) {
    return (
      <a
        { ...attrs }
        href={element.url || undefined}
        target={element.target || undefined}
        rel={element.target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        { children }
      </a>
    );
  }

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onEvent?.(element.event, element);
  };

  return (
    <div role="button" tabIndex={0} { ...attrs } onClick={onClick}>
      { children }
    </div>
  );
};

Clickable.displayName = 'ClickableRenderer';

export default Clickable;
