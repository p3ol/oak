import type { ElementObject } from '@oakjs/core';
import { classNames } from '@junipero/react';

import Text from '../Text';

export declare interface EmptyContainerProps {
  element: ElementObject | null;
  containerKey: string;
  root?: boolean;
}

/**
 * Placeholder displayed in the canvas for empty containers, so that they stay
 * visible and can receive dropped elements. It is only rendered inside the
 * builder (it is not part of the rendered page).
 */
const EmptyContainer = ({ root }: EmptyContainerProps) => (
  <div
    data-oak-placeholder="true"
    className={classNames(
      'oak:flex oak:items-center oak:justify-center oak:text-center',
      'oak:border oak:border-dashed oak:border-cv-placeholder oak:rounded',
      'oak:text-cv-label oak:select-none oak:box-border oak:w-full',
      root
        ? 'oak:min-h-[240px] oak:m-0 oak:text-sm'
        : 'oak:min-h-12 oak:text-xs',
    )}
    style={{ fontFamily: 'var(--junipero-font-family)', lineHeight: 1.4 }}
  >
    { root ? (
      <Text name="ash.canvas.emptyPage">
        Drop components here, or pick one in the Insert panel
      </Text>
    ) : (
      <Text name="ash.canvas.emptyContainer">Empty</Text>
    ) }
  </div>
);

EmptyContainer.displayName = 'EmptyContainer';

export default EmptyContainer;
