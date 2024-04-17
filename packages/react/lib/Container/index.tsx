import { ComponentPropsWithoutRef, useRef } from 'react';
import { Droppable, classNames } from '@junipero/react';
import { Component, ComponentObject, ElementObject } from '@oakjs/core';

import { useBuilder } from '../hooks';
import Element from '../Element';
import Catalogue, { CatalogueRef } from '../Catalogue';

export declare interface ContainerProps extends ComponentPropsWithoutRef<any> {
  element?: ElementObject;
  className?: string;
  content?: Array<ElementObject>;
  component?: ComponentObject | Component;
  depth?: number;
}

const Container = ({
  element,
  component,
  className,
  content = [],
  depth = 0,
}: ContainerProps) => {
  const prependCatalogueRef = useRef<CatalogueRef>();
  const appendCatalogueRef = useRef<CatalogueRef>();
  const { builder } = useBuilder();

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

  const onDrop = (data: ElementObject) => {
    if (component?.disallow?.includes?.(data.type)) {
      return;
    }

    builder.moveElement?.(data, element, {
      parent: content,
      position: 'after',
    });
  };

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
    <Droppable disabled={content.length > 0} onDrop={onDrop}>
      <div
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
