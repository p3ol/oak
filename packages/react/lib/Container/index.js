import { useRef } from 'react';
import { Droppable, classNames } from '@junipero/react';

import { useBuilder } from '../hooks';
import Element from '../Element';
import Catalogue from '../Catalogue';

const Container = ({
  element,
  component,
  className,
  content = [],
  depth = 0,
}) => {
  const prependCatalogueRef = useRef();
  const appendCatalogueRef = useRef();
  const { builder } = useBuilder();

  const onPrepend = c => {
    prependCatalogueRef.current?.close();
    builder.addElement?.({}, {
      parent: content,
      position: 'before',
      component: c,
    });
  };

  const onAppend = c => {
    appendCatalogueRef.current?.close();
    builder.addElement?.({}, {
      parent: content,
      position: 'after',
      component: c,
    });
  };

  const onDrop = data => {
    if (component?.disallow?.includes?.(data.type)) {
      return;
    }

    builder.moveElement?.(data, element, {
      parent: content,
      position: 'after',
    });
  };

  const onPasteBefore = elmt => {
    prependCatalogueRef.current?.close();
    builder.addElement(elmt, {
      parent: content,
      position: 'before',
      resetIds: true,
    });
  };

  const onPasteAfter = elmt => {
    appendCatalogueRef.current?.close();
    builder.addElement(elmt, {
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
