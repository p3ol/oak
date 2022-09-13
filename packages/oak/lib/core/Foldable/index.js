import { omit } from '@poool/junipero-utils';
import { useRef } from 'react';

import { useBuilder } from '../../hooks';
import options from './index.options';
import settings from './index.settings';
import Catalogue from '../Catalogue';
import Droppable from '../Droppable';
import Element from '../Element';

const Row = ({
  element,
  parent,
  ...rest
}) => {
  const { moveElement, addElement, getText } = useBuilder();
  const appendCatalogueRef = useRef();

  const onAppend_ = (parent, position, component) => {
    const elmt = component.construct?.() || {};
    addElement?.({
      ...elmt,
      content: typeof elmt.content === 'function'
        ? elmt.content(getText) : elmt.content,
    }, { parent, position });
    appendCatalogueRef.current?.close();
  };

  const onPrepend_ = (parent, p, component) => {
    const elmt = component.construct?.() || {};
    addElement?.({
      ...elmt,
      content: typeof elmt.content === 'function'
        ? elmt.content(getText) : elmt.content,
    }, { parent, position: 'before' });
    appendCatalogueRef.current?.close();
  };

  const onPasteAfter_ = elmt => {
    addElement(elmt, {
      parent: element.content,
      position: 'after',
      normalizeOptions: { resetIds: true },
    });
    appendCatalogueRef.current?.close();
  };

  const onDropElement = (position, data) => {
    moveElement(data, element, { parent, position });
  };

  return (
    <div
      { ...omit(rest, ['builder']) }
      style={element.style}
    >
      <div>See more content section</div>
      <div className="oak-foldable-content">
        <Droppable disabled={element.cols.length > 0} onDrop={onDropElement}>
          <>
            { element?.cols.length ? (
              <>
                <Catalogue
                  ref={appendCatalogueRef}
                  onAppend={onAppend_.bind(null, element.cols, 'before')}
                  onPaste={onPasteAfter_}
                />
                {element?.cols?.map(elt => (
                  <Element
                    key={elt.id}
                    element={elt}
                    parent={element.cols}
                  />
                ))}
                <Catalogue
                  ref={appendCatalogueRef}
                  onAppend={onAppend_.bind(null, element.cols, 'after')}
                  onPaste={onPasteAfter_}
                />
              </>
            ) : (
              <div className="oak-foldable-content-empty">
                <Catalogue
                  ref={appendCatalogueRef}
                  onAppend={onAppend_.bind(null, element.cols, 'after')}
                  onPaste={onPasteAfter_}
                />
              </div>
            )}
          </>
        </Droppable>
      </div>
      <div>See More title section</div>
      <div className="oak-foldable-content">
        <Droppable disabled={element.seeMore.length > 0} onDrop={onDropElement}>
          <>
            { element?.seeMore.length ? (
              <>
                <Catalogue
                  ref={appendCatalogueRef}
                  onAppend={onAppend_.bind(null, element.seeMore, 'before')}
                  onPaste={onPasteAfter_}
                />
                { element?.seeMore?.map(elt => (
                  <Element
                    key={elt.id}
                    element={elt}
                    parent={element.seeMore}
                  />
                ))}
                <Catalogue
                  ref={appendCatalogueRef}
                  onAppend={onAppend_.bind(null, element.seeMore, 'after')}
                  onPaste={onPasteAfter_}
                />
              </>
            ) : (
              <div className="oak-foldable-content-empty">
                <Catalogue
                  ref={appendCatalogueRef}
                  onAppend={onAppend_.bind(null, element.seeMore, 'after')}
                  onPaste={onPasteAfter_}
                />
              </div>
            )}
          </>
        </Droppable>
      </div>
      <div>See less title section</div>
      <div className="oak-foldable-content">
        <Droppable disabled={element.seeLess.length > 0} onDrop={onDropElement}>
          <>
            { element?.seeLess.length ? (
              <>
                <Catalogue
                  ref={appendCatalogueRef}
                  onAppend={onPrepend_.bind(null, element.seeLess, 'before')}
                  onPaste={onPasteAfter_}
                />
                { element?.seeLess?.map(elt => (
                  <Element
                    key={elt.id}
                    element={elt}
                    parent={element.seeLess}
                  />
                ))}
                <Catalogue
                  ref={appendCatalogueRef}
                  onAppend={onAppend_.bind(null, element.seeLess, 'after')}
                  onPaste={onPasteAfter_}
                />
              </>
            ) : (
              <div className="oak-foldable-content-empty">
                <Catalogue
                  ref={appendCatalogueRef}
                  onAppend={onAppend_.bind(null, element.seeLess, 'after')}
                  onPaste={onPasteAfter_}
                />
              </div>
            )}
          </>
        </Droppable>
      </div>
    </div>
  );
};

Row.options = options;
Row.settings = settings;

export default Row;
