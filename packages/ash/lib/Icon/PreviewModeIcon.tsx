import type { ReactNode } from 'react';

/**
 * Frame shared by preview modes icons (a screen), with the mode's shape inside
 */
const PreviewModeIcon = ({ children }: { children?: ReactNode }) => (
  <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden>
    <rect
      x="1" y="1" width="26" height="20" rx="2.5"
      stroke="currentColor" strokeWidth="1.4"
    />
    { children }
  </svg>
);

export default PreviewModeIcon;
