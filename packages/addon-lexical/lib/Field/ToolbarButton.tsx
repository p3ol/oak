import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import { classNames } from '@junipero/react';

export declare interface ToolbarButtonProps
  extends ComponentPropsWithoutRef<'button'> {
  active?: boolean;
  label: string;
}

/**
 * Doesn't take the focus from the editor when clicked, so that the selection
 * is kept
 */
const ToolbarButton = ({
  active,
  label,
  className,
  onMouseDown,
  ...rest
}: ToolbarButtonProps) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    className={classNames('oak-lexical-button', { active }, className)}
    onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onMouseDown?.(e);
    }}
    { ...rest }
  />
);

ToolbarButton.displayName = 'ToolbarButton';

export default ToolbarButton;
