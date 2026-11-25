import type { SVGProps } from 'react';

const EyeOffIcon = ({
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
    <path
      d={[
        'M10.6 5.1A9.8 9.8 0 0112 5c5 0 8.5 4.2 9.6 6.4a1.3 1.3 0 010 1.2',
        '15 15 0 01-2.3 3.2M6.5 6.6C4.4 8 3 10 2.4 11.4a1.3 1.3 0 000 1.2',
        'C3.5 14.8 7 19 12 19a9.6 9.6 0 005.4-1.6M9.9 9.9a3 3 0 004.2 4.2',
        'M3 3l18 18',
      ].join(' ')}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EyeOffIcon;
