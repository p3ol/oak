import {
  type ReactNode,
  type RefObject,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  type DropdownRef,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  classNames,
} from '@junipero/react';

import { useLexicalField } from './context';
import ToolbarButton from './ToolbarButton';
import Icon from './Icon';

export declare interface ToolbarDropdownRef {
  close(): void;
}

export declare interface ToolbarDropdownProps {
  ref?: RefObject<ToolbarDropdownRef>;
  label: string;
  icon: ReactNode;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  children: ReactNode;
  onToggle?(opened: boolean): void;
}

const ToolbarDropdown = ({
  ref,
  label,
  icon,
  active,
  disabled,
  className,
  menuClassName,
  children,
  onToggle,
}: ToolbarDropdownProps) => {
  const { container } = useLexicalField();
  const dropdownRef = useRef<DropdownRef>(null);

  useImperativeHandle(ref, () => ({
    close: () => dropdownRef.current?.close(),
  }));

  return (
    <Dropdown
      ref={dropdownRef}
      container={container}
      disabled={disabled}
      placement="bottom-start"
      className={classNames('oak-lexical-dropdown', className)}
      onToggle={({ opened }) => onToggle?.(opened)}
    >
      <DropdownToggle>
        <ToolbarButton
          label={label}
          active={active}
          disabled={disabled}
          className="oak-lexical-dropdown-toggle"
        >
          { icon }
          <Icon name="chevron" size={12} />
        </ToolbarButton>
      </DropdownToggle>
      <DropdownMenu
        className={classNames('oak-lexical-menu', menuClassName)}
      >
        { children }
      </DropdownMenu>
    </Dropdown>
  );
};

ToolbarDropdown.displayName = 'ToolbarDropdown';

export default ToolbarDropdown;
