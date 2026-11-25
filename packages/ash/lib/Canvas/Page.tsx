import {
  type ReactNode,
  createContext,
  use,
  useCallback,
  useMemo,
} from 'react';
import type {
  Builder as CoreBuilder,
  ComponentObject,
  ComponentOverride,
  ElementObject,
} from '@oakjs/core';
import { classNames } from '@junipero/react';
import {
  type RendererComponent,
  type RendererComponentsMap,
  type RendererEventCallback,
  type ResolveURLCallback,
  containerAttributes,
  getElementAttributes,
  getElementStatesCSS,
} from '@oakjs/react-renderer';

import { useBuilder, useEditor } from '../hooks';
import { sanitizeHTML } from '../utils';
import { ROOT_CONTAINER_KEY } from '../tree';
import EmptyContainer from './EmptyContainer';

declare interface PageContextValue {
  components: RendererComponentsMap;
  sanitize: (html: string) => string;
  dark: boolean;
  /** Inside the builder (empty containers & editing renderers) */
  editing: boolean;
  isElementDisplayed(element: ElementObject): boolean;
  resolveURL?: ResolveURLCallback;
  onEvent?: RendererEventCallback;
}

const PageContext = createContext<PageContextValue>(null);

const UnknownElement = ({ element, attributes }: {
  element: ElementObject;
  attributes: Record<string, any>;
}) => (
  <div
    { ...attributes }
    className={classNames(
      attributes.className,
      'oak:p-3 oak:border oak:border-dashed oak:border-grapefruit',
      'oak:text-xs oak:text-grapefruit oak:font-mono',
    )}
  >
    Unknown component: { element.type }
  </div>
);

declare interface CanvasElementsProps {
  element: ElementObject | null;
  containerKey: string;
  content?: ElementObject[];
  depth: number;
}

const CanvasElements = ({
  element,
  containerKey,
  content,
  depth,
}: CanvasElementsProps) => {
  const { editing } = use(PageContext);
  const items: ElementObject[] = content ?? (
    Array.isArray(element?.[containerKey]) ? element[containerKey] : []
  );

  if (!items.length) {
    return editing && (
      <EmptyContainer
        element={element}
        containerKey={containerKey}
        root={!element}
      />
    );
  }

  return items.map((child, i) => (
    <CanvasElement key={child?.id ?? i} element={child} depth={depth} />
  ));
};

const CanvasElement = ({
  element,
  depth,
}: { element: ElementObject; depth: number }) => {
  const {
    components,
    sanitize,
    dark,
    editing,
    isElementDisplayed,
    resolveURL,
    onEvent,
  } = use(PageContext);
  const Component = components[element?.type];
  // Content is mutated in place by the builder: attributes are cheap enough
  // to be recomputed on every render
  const attributes = getElementAttributes(element, Component, { dark });
  const statesCSS = getElementStatesCSS(element, { dark });

  const renderContainer = useCallback((key: string): ReactNode => (
    <CanvasElements element={element} containerKey={key} depth={depth + 1} />
  ), [element, depth]);

  // Hidden in the previewed state (e.g. a form field once the form has been
  // submitted): still listed in the layers
  if (!element || !isElementDisplayed(element)) {
    return null;
  }

  if (!Component) {
    return <UnknownElement element={element} attributes={attributes} />;
  }

  return (
    <>
      { statesCSS && <style>{ statesCSS }</style> }
      <Component
        element={element}
        attributes={attributes}
        depth={depth}
        renderContainer={renderContainer}
        editing={editing}
        dark={dark}
        sanitizeHTML={sanitize}
        resolveURL={resolveURL}
        onEvent={onEvent}
      />
    </>
  );
};

export declare interface PageContentProps {
  builder: CoreBuilder;
  content: ElementObject[];
  /** Used to know when renderers change */
  addons?: unknown[];
  polyfills?: {
    DOMParser: typeof DOMParser;
    XMLSerializer: typeof XMLSerializer;
  };
  pageClassName?: string;
  dark?: boolean;
  /** Inside the builder: empty containers are displayed */
  editing?: boolean;
  isElementDisplayed?(element: ElementObject): boolean;
  /** Resolves the urls of resources (e.g. images) before rendering them */
  resolveURL?: ResolveURLCallback;
  /**
   * Events emitted by the elements (e.g. a clickable whose action isn't a
   * link): links are never followed in the canvas
   */
  onEvent?: RendererEventCallback;
}

const ALWAYS_DISPLAYED = () => true;

/**
 * Renders content with each component's page renderer (inside the builder's
 * canvas, or a read-only preview)
 */
export const PageContent = ({
  builder,
  content,
  addons,
  polyfills,
  pageClassName,
  dark = false,
  editing = false,
  isElementDisplayed = ALWAYS_DISPLAYED,
  resolveURL,
  onEvent,
}: PageContentProps) => {
  const components = useMemo<RendererComponentsMap>(() => {
    const map: RendererComponentsMap = {};

    builder.getAvailableComponents().forEach(group => {
      (group.components || []).forEach((c: ComponentObject) => {
        const override = builder
          .getOverride('component', c.id) as ComponentOverride;
        const render = (override?.render || c.render) as RendererComponent;

        if (render) {
          map[c.id] = render;
        }
      });
    });

    return map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builder, addons]);

  const sanitize = useCallback((html: string) => sanitizeHTML(html, {
    parser: polyfills?.DOMParser,
    serializer: polyfills?.XMLSerializer,
  }), [polyfills]);

  const context = useMemo(() => ({
    components, sanitize, dark, editing, isElementDisplayed, resolveURL,
    onEvent,
  }), [
    components, sanitize, dark, editing, isElementDisplayed, resolveURL,
    onEvent,
  ]);

  return (
    <PageContext value={context}>
      <div
        className={classNames(
          'oak-ash-page oak:@container oak:flex-auto',
          pageClassName,
        )}
        { ...containerAttributes(ROOT_CONTAINER_KEY) }
      >
        <CanvasElements
          element={null}
          containerKey={ROOT_CONTAINER_KEY}
          content={content || []}
          depth={0}
        />
      </div>
    </PageContext>
  );
};

PageContent.displayName = 'PageContent';

/**
 * Renders the builder content inside the canvas, using each component's page
 * renderer.
 */
const Page = () => {
  const {
    builder,
    content,
    addons,
    polyfills,
    pageClassName,
    resolveURL,
  } = useBuilder();
  const { canvasTheme, isElementDisplayed, onPreviewEvent } = useEditor();

  return (
    <PageContent
      editing
      builder={builder}
      content={content}
      addons={addons}
      polyfills={polyfills}
      pageClassName={pageClassName}
      dark={canvasTheme === 'dark'}
      isElementDisplayed={isElementDisplayed}
      resolveURL={resolveURL}
      onEvent={onPreviewEvent}
    />
  );
};

Page.displayName = 'Page';

export default Page;
