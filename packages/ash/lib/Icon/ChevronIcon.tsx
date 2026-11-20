import type { SVGProps } from 'react';
import { classNames } from '@junipero/react';

export declare interface ChevronIconProps extends SVGProps<SVGSVGElement> {
  /** Points down when opened, right otherwise */
  open?: boolean;
}

const ChevronIcon = ({ open = false, className, ...rest }: ChevronIconProps) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden
    { ...rest }
    className={classNames(
      'oak:flex-none oak:transition-transform oak:duration-100',
      { 'oak:rotate-90': open },
      className,
    )}
  >
    <path
      d="M4.5 2.5L8 6l-3.5 3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronIcon;
