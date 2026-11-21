import type { SVGProps } from 'react';

const PlusIcon = ({
  size = 18,
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
      d="M6 12h12M12 6v12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default PlusIcon;
