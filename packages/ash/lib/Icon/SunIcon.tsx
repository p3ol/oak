import type { SVGProps } from 'react';

const SunIcon = ({
  size = 16,
  ...rest
}: SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    { ...rest }
  >
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d={
        'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2' +
        'M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'
      }
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default SunIcon;
