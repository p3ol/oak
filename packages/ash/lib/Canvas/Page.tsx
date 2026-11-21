import {
  type ReactNode,
  createContext,
  use,
  useCallback,
  useMemo,
} from 'react';
import type {
  ComponentObject,
  ComponentOverride,
  ElementObject,
} from '@oakjs/core';
import { classNames } from '@junipero/react';
import {
  type RendererComponent,
  type RendererComponentsMap,
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
  const items: ElementObject[] = content ?? (
    Array.isArray(element?.[containerKey]) ? element[containerKey] : []
  );

  if (!items.length) {
    return (
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
  const { components, sanitize, dark } = use(PageContext);
  const { isElementDisplayed } = useEditor();
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
        editing={true}
        dark={dark}
        sanitizeHTML={sanitize}
      />
    </>
  );
};

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
  } = useBuilder();
  const { canvasTheme } = useEditor();
  const dark = canvasTheme === 'dark';

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

  const context = useMemo(() => ({ components, sanitize, dark }), [
    components, sanitize, dark,
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

Page.displayName = 'Page';

export default Page;
