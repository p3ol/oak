import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/*
 * Inline icons (24px grid, 2px strokes like junipero's icons), so that the
 * field doesn't depend on an icon font
 */
const ICONS: Record<string, ReactNode> = {
  undo: <><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></>,
  redo: <><path d="m15 14 5-5-5-5" /><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" /></>,
  bold: <path d="M7 12h8a4 4 0 0 1 0 8H7V4h7a4 4 0 0 1 0 8" />,
  italic: <><path d="M19 4h-9" /><path d="M14 20H5" /><path d="M15 4 9 20" /></>,
  underline: <><path d="M6 4v6a6 6 0 0 0 12 0V4" /><path d="M4 20h16" /></>,
  strikethrough: (
    <>
      <path d="M16 4H9a3 3 0 0 0-2.83 4" />
      <path d="M14 12a4 4 0 0 1 0 8H6" />
      <path d="M4 12h16" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  fontColor: <><path d="m6 15 6-12 6 12" /><path d="M8.5 10h7" /></>,
  fontSize: (
    <>
      <path d="M3 7V5h11v2" />
      <path d="M8.5 5v14" />
      <path d="M6.5 19h4" />
      <path d="M14 13v-1h7v1" />
      <path d="M17.5 12v7" />
      <path d="M16 19h3" />
    </>
  ),
  bulletedList: (
    <>
      <path d="M9 6h11" />
      <path d="M9 12h11" />
      <path d="M9 18h11" />
      <circle cx="4.5" cy="6" r=".5" />
      <circle cx="4.5" cy="12" r=".5" />
      <circle cx="4.5" cy="18" r=".5" />
    </>
  ),
  numberedList: (
    <>
      <path d="M10 6h10" />
      <path d="M10 12h10" />
      <path d="M10 18h10" />
      <path d="M4 4h1v4" />
      <path d="M4 8h2" />
      <path d="M6 20H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </>
  ),
  removeFormat: (
    <>
      <path d="M4 7V4h16v3" />
      <path d="M5 20h6" />
      <path d="M13 4 8 20" />
      <path d="m15 15 5 5" />
      <path d="m20 15-5 5" />
    </>
  ),
  outdent: (
    <>
      <path d="m7 8-4 4 4 4" />
      <path d="M21 6H11" />
      <path d="M21 12H11" />
      <path d="M21 18H11" />
    </>
  ),
  indent: (
    <>
      <path d="m3 8 4 4-4 4" />
      <path d="M21 6H11" />
      <path d="M21 12H11" />
      <path d="M21 18H11" />
    </>
  ),
  alignLeft: <><path d="M21 6H3" /><path d="M15 12H3" /><path d="M17 18H3" /></>,
  alignCenter: <><path d="M21 6H3" /><path d="M17 12H7" /><path d="M19 18H5" /></>,
  alignRight: <><path d="M21 6H3" /><path d="M21 12H9" /><path d="M21 18H7" /></>,
  alignJustify: <><path d="M21 6H3" /><path d="M21 12H3" /><path d="M21 18H3" /></>,
  horizontalLine: (
    <>
      <path d="M3 12h18" />
      <path d="M8 6h8" opacity=".4" />
      <path d="M8 18h8" opacity=".4" />
    </>
  ),
  blockQuote: (
    <>
      <path d="M5 17c3-1 4-3 4-6V7H4v5h5" />
      <path d="M15 17c3-1 4-3 4-6V7h-5v5h5" />
    </>
  ),
  insertTable: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M12 3v18" />
    </>
  ),
  heading: <><path d="M6 4v16" /><path d="M18 4v16" /><path d="M6 12h12" /></>,
  chevron: <path d="m6 9 6 6 6-6" />,
};

export declare interface IconProps extends ComponentPropsWithoutRef<'svg'> {
  name: keyof typeof ICONS | string;
  /** Color of the bar under the font color icon */
  color?: string;
  size?: number;
}

const Icon = ({ name, color, size = 18, ...rest }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="oak-lexical-icon"
    { ...rest }
  >
    { ICONS[name] }
    { name === 'fontColor' && (
      <rect
        x="4"
        y="18"
        width="16"
        height="3"
        rx="1"
        stroke="none"
        fill={color || 'currentColor'}
      />
    ) }
  </svg>
);

Icon.displayName = 'Icon';

export default Icon;
