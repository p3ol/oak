import { Tooltip, classNames } from '@junipero/react';

const MenuButton = ({
  onClick,
  enabled,
  isActive,
  className,
  tooltipText,
  children,
}) => {
  const onClick_ = e => {
    e.preventDefault();
    onClick?.();
  };

  if (!enabled?.()) {
    return null;
  }

  return (
    <Tooltip text={tooltipText}>
      <a
        href="#"
        onClick={onClick_}
        className={classNames(
          'menu-button',
          { active: isActive?.() },
          className,
        )}
        children={children}
      />
    </Tooltip>
  );
};

MenuButton.displayName = 'MenuButton';

export default MenuButton;
