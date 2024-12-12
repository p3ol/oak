import type { Component, ComponentObject, ElementObject } from '@oakjs/core';
import {
  type ComponentPropsWithoutRef,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { Droppable, classNames } from '@junipero/react';

import { useBuilder } from '../hooks';
import Element from '../Element';
import Catalogue, { type CatalogueRef } from '../Catalogue';

export declare interface ContainerProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'content'> {
  element?: ElementObject;
  content?: Array<ElementObject>;
  component?: ComponentObject | Component;
  depth?: number;
  droppable?: boolean;
}

const Container = ({
  element,
  component,
  className,
  droppable = true,
  content = [],
  depth = 0,
  ...rest
}: ContainerProps) => {
  const prependCatalogueRef = useRef<CatalogueRef>(null);
  const appendCatalogueRef = useRef<CatalogueRef>(null);
  const { builder, addons } = useBuilder();
  const override = useMemo(() => (
    builder.getOverride('component', component?.id) as ComponentObject
  ), [component, builder, addons]);

  const onPrepend = (c: Component | ComponentObject) => {
    prependCatalogueRef.current?.close();
    builder.addElement?.({}, {
      parent: content,
      position: 'before',
      component: c,
    });
  };

  const onAppend = (c: Component | ComponentObject) => {
    appendCatalogueRef.current?.close();
    builder.addElement?.({}, {
      parent: content,
      position: 'after',
      component: c,
    });
  };

  const onDrop = useCallback((
    data: ElementObject,
  ) => {
    if (
      component?.disallow?.includes?.(data.type) ||
      override?.disallow?.includes?.(data.type)
    ) {
      return;
    }

    builder.moveElement?.(data, element, {
      parent: content,
      position: 'after',
    });
  }, [builder, content, element, component, override]);

  const onPasteBefore = (elmt: ElementObject) => {
    prependCatalogueRef.current?.close();
    builder.addElements([].concat(elmt || []), {
      parent: content,
      position: 'before',
      resetIds: true,
    });
  };

  const onPasteAfter = (elmt: ElementObject) => {
    appendCatalogueRef.current?.close();
    builder.addElements([].concat(elmt || []), {
      parent: content,
      position: 'after',
      resetIds: true,
    });
  };

  return (
    <Droppable
      disabled={
        content.length > 0 ||
        (override?.droppable ?? droppable) === false
      }
      onDrop={onDrop}
    >
      <div
        { ...rest }
        className={classNames(
          'container oak-flex-auto oak-flex oak-flex-col oak-gap-2',
          'oak-p-4',
          depth % 2 === 0 ? 'even' : 'odd',
          className
        )}
        data-depth={depth}
      >
        { content.length > 0 && (
          <Catalogue
            ref={prependCatalogueRef}
            component={component}
            onAppend={onPrepend}
            onPaste={onPasteBefore}
            className="oak-inline-flex oak-self-center small"
          />
        ) }

        { content.length > 0 && (
          <div className="content oak-flex oak-flex-col oak-gap-4">
            { content.map((elt, i) => (
              <Element
                depth={depth + 1}
                key={elt.id || i}
                index={i}
                element={elt}
                parent={content}
                parentComponent={component}
              />
            )) }
          </div>
        ) }

        <Catalogue
          ref={appendCatalogueRef}
          component={component}
          onAppend={onAppend}
          onPaste={onPasteAfter}
          className={classNames(
            'oak-inline-flex oak-self-center',
            { small: content.length > 0 }
          )}
        />
      </div>
    </Droppable>
  );
};

Container.displayName = 'Container';

export default Container;
