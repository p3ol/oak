import type { ReactNode } from 'react';
import { Resizable } from 're-resizable';
import { classNames } from '@junipero/react';

export declare interface SidebarProps {
  side: 'left' | 'right';
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  children?: ReactNode;
  onResize?: (width: number) => void;
}

const HANDLE_CLASS = classNames(
  'oak:z-30 oak:transition-colors oak:delay-75',
  'oak:hover:bg-velvet/40 oak:active:bg-velvet',
);

const Sidebar = ({
  side,
  defaultWidth = 260,
  minWidth = 200,
  maxWidth = 520,
  className,
  children,
  onResize,
}: SidebarProps) => (
  <Resizable
    as="aside"
    className={classNames(
      'oak-ash-sidebar oak:flex oak:flex-col oak:flex-none oak:bg-ash-surface',
      'oak:min-h-0 oak:h-full',
      side === 'left'
        ? 'oak:border-r oak:border-ash-border'
        : 'oak:border-l oak:border-ash-border',
      className,
    )}
    defaultSize={{ width: defaultWidth, height: '100%' }}
    minWidth={minWidth}
    maxWidth={maxWidth}
    enable={{
      top: false,
      bottom: false,
      topLeft: false,
      topRight: false,
      bottomLeft: false,
      bottomRight: false,
      left: side === 'right',
      right: side === 'left',
    }}
    handleClasses={{ left: HANDLE_CLASS, right: HANDLE_CLASS }}
    handleStyles={{
      left: { width: 5, left: -3 },
      right: { width: 5, right: -3 },
    }}
    onResizeStop={(_e, _dir, ref) => onResize?.(ref.offsetWidth)}
  >
    { children }
  </Resizable>
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
