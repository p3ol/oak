import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import { classNames } from '@junipero/react';

export declare interface MenuItemProps
  extends ComponentPropsWithoutRef<'button'> {
  active?: boolean;
}

/** Dropdown entry that doesn't take the focus from the editor */
const MenuItem = ({ active, className, ...rest }: MenuItemProps) => (
  <li className="oak-lexical-menu-item">
    <button
      type="button"
      className={classNames({ active }, className)}
      onMouseDown={(e: MouseEvent) => e.preventDefault()}
      { ...rest }
    />
  </li>
);

MenuItem.displayName = 'MenuItem';

export default MenuItem;
