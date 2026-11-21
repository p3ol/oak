import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

import type { RendererComponentProps } from '../../types';
import { REVEAL_EVENT, containerAttributes } from '../../utils';

/**
 * Collapsed by default: displays the "see more" label, and its content (+ the
 * "see less" label) once clicked. Every section is always rendered (inactive
 * ones are `hidden`), so that hidden elements can be revealed (see
 * `REVEAL_EVENT`).
 */
const Foldable = ({
  element,
  attributes,
  renderContainer,
}: RendererComponentProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const seeMoreRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const position = element.settings?.seeMorePosition || 'after';

  // Open (or close) to display a hidden descendant asking to be revealed
  useEffect(() => {
    const el = innerRef.current;

    const onReveal = (e: Event) => {
      setOpened(!seeMoreRef.current?.contains(e.target as Node));
    };

    el?.addEventListener(REVEAL_EVENT, onReveal);

    return () => el?.removeEventListener(REVEAL_EVENT, onReveal);
  }, []);

  const toggle = () => setOpened(o => !o);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  const toggles = (['seeMore', 'seeLess'] as const).map(key => (
    <div
      key={key}
      ref={key === 'seeMore' ? seeMoreRef : undefined}
      role="button"
      tabIndex={0}
      aria-expanded={opened}
      hidden={key === 'seeMore' ? opened : !opened}
      className="oak:cursor-pointer"
      onClick={toggle}
      onKeyDown={onKeyDown}
      { ...containerAttributes(key) }
    >
      { renderContainer(key) }
    </div>
  ));

  return (
    <div ref={innerRef} { ...attributes }>
      { position === 'before' && toggles }
      <div hidden={!opened} { ...containerAttributes('content') }>
        { renderContainer('content') }
      </div>
      { position !== 'before' && toggles }
    </div>
  );
};

Foldable.displayName = 'FoldableRenderer';

export default Foldable;
