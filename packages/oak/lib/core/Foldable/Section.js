import { useRef } from 'react';
import { Droppable, classNames } from '@junipero/react';

import Element from '../Element';
import Catalogue from '../Catalogue';

const Section = ({
  content = [],
  title,
  className,
  onDropElement,
  onAppend,
  onPaste,
  ...rest
}) => {
  const catalogueRef = useRef();

  const onAppend_ = (...args) => {
    catalogueRef.current?.close();
    onAppend?.(...args);
  };

  const onPaste_ = (...args) => {
    catalogueRef.current?.close();
    onPaste?.(...args);
  };

  return (
    <div className={classNames('oak-foldable-section', className)} { ...rest }>
      <div className="oak-foldable-section-title">
        { title }
      </div>
      <Droppable
        disabled={content.length > 0}
        onDrop={onDropElement}
      >
        <div className="oak-foldable-section-content">
          { content.length ? (
            <>
              <Catalogue
                ref={catalogueRef}
                onAppend={onAppend_.bind(null, 'before')}
                onPaste={onPaste_.bind(null, 'before')}
              />
              { content.map(elt => (
                <Element
                  key={elt.id}
                  element={elt}
                  parent={content}
                />
              ))}
              <Catalogue
                ref={catalogueRef}
                onAppend={onAppend_.bind(null, 'after')}
                onPaste={onPaste_.bind(null, 'after')}
              />
            </>
          ) : (
            <div className="oak-foldable-section-content-empty">
              <Catalogue
                ref={catalogueRef}
                onAppend={onAppend_.bind(null, 'after')}
                onPaste={onPaste_.bind(null, 'after')}
              />
            </div>
          )}
        </div>
      </Droppable>
    </div>
  );
};

export default Section;
