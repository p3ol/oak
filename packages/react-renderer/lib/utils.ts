import type { CSSProperties } from 'react';
import { classNames } from '@junipero/core';

import type {
  Breakpoint,
  ElementObject,
  ElementAttributes,
  ElementRenderOptions,
  ElementStyles,
  RendererComponent,
} from './types';

export const BREAKPOINTS: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];

/**
 * Container widths (in px) at which each breakpoint starts.
 * Responsive rules use container queries (not media queries) so that the
 * content adapts to its container width: this allows builders to preview
 * any screen size without resizing the window.
 */
export const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

// Class names must be written in full so that tailwind can find them
const HIDDEN_CLASSES: Record<Breakpoint, string> = {
  xs: 'oak:@max-[575.98px]:hidden',
  sm: 'oak:@min-[576px]:@max-[767.98px]:hidden',
  md: 'oak:@min-[768px]:@max-[991.98px]:hidden',
  lg: 'oak:@min-[992px]:@max-[1199.98px]:hidden',
  xl: 'oak:@min-[1200px]:hidden',
};

// Generated through @source inline() in tailwind.css
const COL_VARIANTS: Record<Breakpoint, string> = {
  xs: 'oak:',
  sm: 'oak:@min-[576px]:',
  md: 'oak:@min-[768px]:',
  lg: 'oak:@min-[992px]:',
  xl: 'oak:@min-[1200px]:',
};

const COL_VALUES = [
  'fluid', 'auto', 'hide', ...Array.from({ length: 12 }, (_, i) => i + 1),
];

const isNumeric = (value: unknown) =>
  typeof value === 'number' ||
  (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value.trim()));

/**
 * Appends `px` to unitless numeric values, and returns undefined for empty
 * values so they are omitted from the style object.
 */
export const toCSSUnit = (value: unknown): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (isNumeric(value)) {
    return Number(value) === 0 ? '0' : `${value}px`.replace(/\s/g, '');
  }

  return String(value);
};

const SIDES = ['Top', 'Right', 'Bottom', 'Left'] as const;
const CORNERS = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'] as const;

const assignIfDefined = (
  target: Record<string, any>,
  key: string,
  value: unknown,
) => {
  if (value !== undefined && value !== null && value !== '') {
    target[key] = value;
  }
};

/**
 * Converts oak's element styling settings (`element.styles`) into a react
 * style object.
 */
export const getElementStyle = (styles?: ElementStyles): CSSProperties => {
  if (!styles || typeof styles !== 'object') {
    return {};
  }

  const style: Record<string, any> = {};

  SIDES.forEach(side => {
    assignIfDefined(style, `padding${side}`, toCSSUnit(styles[`padding${side}`]));
    assignIfDefined(style, `margin${side}`, toCSSUnit(styles[`margin${side}`]));

    const borderWidth = toCSSUnit(styles[`border${side}`]);

    if (borderWidth) {
      style[`border${side}Width`] = borderWidth;
      // A border width without style would be invisible
      style[`border${side}Style`] = styles[`border${side}Style`] || 'solid';
    } else {
      assignIfDefined(style, `border${side}Style`, styles[`border${side}Style`]);
    }

    assignIfDefined(style, `border${side}Color`, styles[`border${side}Color`]);
  });

  CORNERS.forEach(corner => {
    assignIfDefined(
      style,
      `border${corner}Radius`,
      toCSSUnit(styles[`border${corner}Radius`]),
    );
  });

  assignIfDefined(style, 'backgroundColor', styles.backgroundColor);

  const backgroundImage = typeof styles.backgroundImage === 'string'
    ? styles.backgroundImage
    : styles.backgroundImage?.url;

  if (backgroundImage) {
    style.backgroundImage = `url("${String(backgroundImage)
      .replace(/"/g, '\\"')}")`;
    style.backgroundSize = styles.backgroundSize &&
      styles.backgroundSize !== 'default' ? styles.backgroundSize : undefined;
    assignIfDefined(style, 'backgroundPosition', styles.backgroundPosition);
    assignIfDefined(style, 'backgroundRepeat', styles.backgroundRepeat);
  }

  if (
    [
      styles.boxShadowX, styles.boxShadowY,
      styles.boxShadowBlur, styles.boxShadowSpread,
    ].some(v => v !== undefined && v !== null && v !== '')
  ) {
    style.boxShadow = [
      toCSSUnit(styles.boxShadowX) || '0',
      toCSSUnit(styles.boxShadowY) || '0',
      toCSSUnit(styles.boxShadowBlur) || '0',
      toCSSUnit(styles.boxShadowSpread) || '0',
      styles.boxShadowColor || 'rgba(0, 0, 0, 0.25)',
    ].join(' ');
  }

  Object.keys(style).forEach(k => style[k] === undefined && delete style[k]);

  return style;
};

const toKebabCase = (str: string) =>
  str.replace(/[A-Z]/g, m => '-' + m.toLowerCase());

const escapeAttribute = (value: string) =>
  String(value).replace(/["\\]/g, '\\$&');

/**
 * Generates the css rules for interactive states (hover, active) that cannot
 * be expressed through inline styles.
 */
export const getElementStatesCSS = (
  element: ElementObject,
  { dark = false }: ElementRenderOptions = {},
): string => {
  const rules: string[] = [];

  (['hover', 'active'] as const).forEach(state => {
    const style = {
      ...getElementStyle(element.styles?.[state]),
      ...dark && getElementStyle(element.styles?.dark?.[state]),
    };
    const declarations = Object.entries(style)
      .map(([k, v]) => `${toKebabCase(k)}:${v} !important`)
      .join(';');

    if (declarations) {
      rules.push(
        `[data-oak-id="${escapeAttribute(String(element.id))}"]:${state}` +
        `{${declarations}}`
      );
    }
  });

  return rules.join('');
};

/**
 * Returns classes hiding the element on the breakpoints where it was set as
 * hidden (`element.responsive[breakpoint] === 'hide'`).
 */
export const getVisibilityClasses = (element: ElementObject): string =>
  classNames(
    BREAKPOINTS
      .filter(bp => element.responsive?.[bp] === 'hide')
      .map(bp => HIDDEN_CLASSES[bp])
  );

/**
 * Returns the size classes of a column, for every breakpoint.
 * The base size (`element.size`) is used for every breakpoint that doesn't
 * declare a specific size in `element.responsive`.
 */
export const getColClasses = (element: ElementObject): string => {
  const base = COL_VALUES.includes(element.size) ? element.size : 'fluid';
  const classes: string[] = [];
  let previous: string | number = null;

  BREAKPOINTS.forEach(bp => {
    const value = COL_VALUES.includes(element.responsive?.[bp])
      ? element.responsive[bp]
      : base;

    if (value !== previous) {
      classes.push(`${COL_VARIANTS[bp]}colsize-${value}`);
      previous = value;
    }
  });

  return classNames(classes);
};

/**
 * Merges additional attributes into the attributes given by the renderer,
 * concatenating classNames & merging styles.
 */
export const mergeAttributes = (
  attributes: ElementAttributes,
  ...others: (ElementAttributes | null | undefined | false)[]
): ElementAttributes =>
  others.reduce<ElementAttributes>((res, other) => {
    if (!other) {
      return res;
    }

    return {
      ...res,
      ...other,
      className: classNames(res.className, other.className) || undefined,
      style: { ...other.style, ...res.style },
    };
  }, { ...attributes });

/**
 * DOM event dispatched (bubbling) by builders on an element that is hidden
 * by one of its ancestors (e.g. inside a collapsed foldable) and needs to be
 * displayed. Components hiding their children should listen to it on their
 * root node and display the section containing `event.target`.
 */
export const REVEAL_EVENT = 'oak:reveal';

/**
 * Attributes to put on the DOM node that directly wraps a list of child
 * elements. Builders rely on them to know where elements can be dropped.
 */
export const containerAttributes = (key: string) => ({
  'data-oak-container': key,
});

/**
 * Computes the attributes every rendered element should receive (see
 * `RendererComponentProps.attributes`): data attributes, className (custom
 * class & responsive visibility), style (from styling settings), dir & role.
 */
export const getElementAttributes = (
  element: ElementObject,
  component?: RendererComponent,
  { dark = false }: ElementRenderOptions = {},
): ElementAttributes => {
  const style = {
    ...getElementStyle(element?.styles),
    ...dark && getElementStyle(element?.styles?.dark),
  };

  return {
    'data-oak-id': element?.id !== undefined ? String(element.id) : undefined,
    'data-oak-type': element?.type,
    className: classNames(
      element?.settings?.className,
      dark && element?.settings?.dark?.className,
      !component?.oakHandlesResponsive && getVisibilityClasses(element),
    ) || undefined,
    ...element?.settings?.dir && { dir: element.settings.dir },
    ...element?.settings?.role && { role: element.settings.role },
    ...Object.keys(style).length > 0 && { style },
  };
};
