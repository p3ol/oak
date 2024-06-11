import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';
import { Tooltip, classNames } from '@junipero/react';

export interface MenuButtonProps extends ComponentPropsWithoutRef<'a'> {
  onClick?: () => void;
  enabled?: () => boolean;
  isActive?: () => boolean;
  tooltipText?: ReactNode;
}

const MenuButton = ({
  onClick,
  enabled,
  isActive,
  className,
  tooltipText,
  ...rest
}: MenuButtonProps) => {
  const onClick_ = (e: MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  if (!enabled?.()) {
    return null;
  }

  return (
    <Tooltip text={tooltipText}>
      <a
        className={classNames(
          'menu-button',
          'oak-flex oak-items-center oak-justify-center',
          { active: isActive?.() },
          className,
        )}
        { ...rest }
        href="#"
        onClick={onClick_}
      />
    </Tooltip>
  );
};

MenuButton.displayName = 'MenuButton';

export default MenuButton;
