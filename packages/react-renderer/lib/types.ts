import type { ComponentType, HTMLAttributes, ReactNode } from 'react';

/**
 * An element of oak's content. Structurally identical to `@oakjs/core`'s
 * ElementObject, redeclared so that the renderer doesn't depend on core.
 */
export declare interface ElementObject {
  id?: string | number;
  type?: string;
  content?: string | ((content: string) => any) | ElementObject[];
  [key: string]: any;
}

export declare type ElementAttributes = HTMLAttributes<HTMLElement> & {
  'data-oak-id'?: string;
  'data-oak-type'?: string;
  [key: `data-${string}`]: string | undefined;
};

export declare type SanitizeHTMLCallback = (html: string) => string;

/**
 * Resolves the url of a resource (e.g. an image) before it is rendered, e.g.
 * to replace a css variable (`var(--brand-logo)`) with the url it holds
 */
export declare type ResolveURLCallback = (
  url: string,
  element: ElementObject,
) => string;

export declare type RendererEventCallback = (
  event: string,
  element: ElementObject,
) => void;

export declare interface RendererComponentProps {
  /**
   * The element to render
   */
  element: ElementObject;
  /**
   * Attributes that MUST be spread on the root DOM node of the rendered
   * component. They contain the computed className & style (from the
   * element's settings) and data attributes used by builders to identify the
   * element in the DOM.
   */
  attributes: ElementAttributes;
  /**
   * Renders the child elements stored in `element[containerKey]`.
   * Container components (row, col, foldable, ...) use it to render their
   * children without knowing how the content tree is walked.
   */
  renderContainer: (containerKey: string) => ReactNode;
  /**
   * Nesting depth of the element (0 = root)
   */
  depth?: number;
  /**
   * Editing mode is enabled when the content is rendered inside a builder.
   * Components may slightly adapt their output in this mode (e.g. show every
   * section of a foldable, or display a placeholder for an empty image), but
   * should otherwise render exactly like they would on the final page.
   */
  editing?: boolean;
  /**
   * Whether the content is displayed in dark mode. Dark styles
   * (`element.styles.dark`) are already merged into `attributes`, but
   * components may need it to adapt their default appearance.
   */
  dark?: boolean;
  /**
   * Used to sanitize raw html content (titles, texts, buttons)
   */
  sanitizeHTML?: SanitizeHTMLCallback;
  /**
   * Used to resolve the urls of resources (e.g. images) before rendering them
   */
  resolveURL?: ResolveURLCallback;
  /**
   * Called when an element with an `event` action is clicked
   */
  onEvent?: RendererEventCallback;
}

export declare type RendererComponent =
  ComponentType<RendererComponentProps> & {
    /**
     * Set to true if the component computes its own responsive classes
     * (e.g. columns), so that the default visibility classes are not applied
     * by whatever walks the content tree (see `getElementAttributes`).
     */
    oakHandlesResponsive?: boolean;
  };

export declare type RendererComponentsMap = Record<string, RendererComponent>;

export declare type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export declare type ElementStyles = Record<string, any>;

export declare interface ElementRenderOptions {
  /**
   * Use the element's dark styles (`styles.dark`, `settings.dark.className`)
   * on top of its default styles
   */
  dark?: boolean;
}
