import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { BuilderOptions, ElementObject } from '@oakjs/core';
import { classNames } from '@junipero/react';

import type {
  AshAddonObject,
  PageValue,
  PreviewSettingObject,
  PreviewValue,
  Theme,
} from '../types';
import { useRootBuilder } from '../hooks';
import {
  getPreviewFilters,
  getPreviewSettings,
  isDisplayedWith,
} from '../previewSettings';
import { PageContent } from '../Canvas/Page';

export declare interface PreviewProps extends Omit<
  ComponentPropsWithoutRef<'div'>, 'content'
> {
  /** Same addons as the builder's (they provide the page renderers) */
  addons: AshAddonObject[];
  /** Content to preview */
  value?: ElementObject[];
  /** Page settings values, given to `renderPageHead` */
  pageValue?: PageValue;
  /**
   * Values of the preview settings (see the builder's `previewSettings`),
   * defaults are used otherwise
   */
  previewValue?: PreviewValue;
  previewSettings?: PreviewSettingObject[];
  /** Same as the builder's */
  renderPageHead?(value: PageValue): ReactNode;
  /** Same as the builder's */
  pageClassName?: string;
  /** Same as the builder's */
  polyfills?: {
    DOMParser: typeof DOMParser;
    XMLSerializer: typeof XMLSerializer;
  };
  options?: Partial<BuilderOptions>;
  activeTextSheet?: string;
  /** Theme of the previewed page (like the canvas theme) */
  theme?: Theme;
  /**
   * Width of the previewed page, in px. It is scaled down to fit the
   * available width.
   */
  width?: number;
}

/**
 * Read-only preview of some content, rendered exactly like in the builder's
 * canvas (same renderers, page head & theme), e.g. to preview templates
 * before applying them
 */
const Preview = ({
  addons,
  value,
  pageValue,
  previewValue,
  previewSettings: previewSettingsProp,
  renderPageHead,
  pageClassName,
  polyfills,
  options,
  activeTextSheet,
  theme = 'light',
  width = 1024,
  className,
  style,
  ...rest
}: PreviewProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | null>(null);
  const builderOptions = useMemo(() => ({
    ...options,
    // Never edited
    history: false,
  }), [options]);
  const { builder, content, version } = useRootBuilder({
    content: value || [],
    addons: addons as any[],
    options: builderOptions,
    activeTextSheet,
  });

  // Fit the available width
  useLayoutEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;

    if (!root || !frame) {
      return;
    }

    const update = () => {
      const next = root.clientWidth ? Math.min(1, root.clientWidth / width) : 1;
      setScale(next);
      setHeight(frame.offsetHeight * next);
    };

    update();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(update);
    observer.observe(root);
    observer.observe(frame);

    return () => observer.disconnect();
  }, [width]);

  const previewSettings = useMemo(() => getPreviewSettings(
    addons, previewSettingsProp,
  ), [addons, previewSettingsProp]);

  const currentPreviewValue = useMemo(() => previewValue || {}, [previewValue]);

  const filters = useMemo(() => getPreviewFilters(
    builder, previewSettings, currentPreviewValue,
  // Conditions can depend on the content: mutated in place, version changes
  // on every update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [builder, previewSettings, currentPreviewValue, content, version]);

  const isElementDisplayed = useCallback((element: ElementObject) => (
    isDisplayedWith(filters, element, currentPreviewValue)
  ), [filters, currentPreviewValue]);

  return (
    <div
      { ...rest }
      ref={rootRef}
      className={classNames(
        'oak-ash oak-ash-canvas oak-ash-preview oak:relative',
        'oak:overflow-hidden oak:w-full',
        { 'oak-ash-canvas-dark': theme === 'dark' },
        className,
      )}
      style={{ ...style, ...height !== null && { height } }}
    >
      <div
        ref={frameRef}
        // Only previewed: links, buttons & fields can't be used
        inert
        className={classNames(
          'oak-ash-frame oak:flex oak:flex-col oak:bg-cv-page',
          'oak:origin-top-left',
        )}
        style={{ width, transform: `scale(${scale})` }}
      >
        { renderPageHead?.(pageValue || {}) }
        <PageContent
          builder={builder}
          content={content}
          addons={addons}
          polyfills={polyfills}
          pageClassName={pageClassName}
          dark={theme === 'dark'}
          isElementDisplayed={isElementDisplayed}
        />
      </div>
    </div>
  );
};

Preview.displayName = 'Preview';

export default Preview;
