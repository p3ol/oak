import type { SVGProps } from 'react';

const MoonIcon = ({
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
      d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export default MoonIcon;
