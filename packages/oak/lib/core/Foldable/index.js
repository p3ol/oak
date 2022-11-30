import { useRef } from 'react';
import { omit } from '@junipero/react';

import { useBuilder } from '../../hooks';
import options from './index.options';
import settings from './index.settings';
import Catalogue from '../Catalogue';
import Droppable from '../Droppable';
import Element from '../Element';
import Text from '../Text';

const Foldable = ({
  element,
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

  const onPaste = (parent, position, elmt) => {
    addElement(elmt, {
      parent,
      position,
      normalizeOptions: { resetIds: true },
    });
    appendCatalogueRef.current?.close();
  };

  const onDropElement = (parent, data) => {
    moveElement(data, element, { parent, position: 'before' });
  };

  return (
    <div
      { ...omit(rest, ['builder']) }
    >
      <div className="oak-foldable-section-title">
        <Text
          name="core.components.foldable.sectionsTitle.seeMore"
          default="Label when collapsed"
        />
      </div>
      <Droppable
        disabled={element.seeMore.length > 0}
        onDrop={onDropElement.bind(null, element.seeMore)}
      >
        <div className="oak-foldable-content">
          { element?.seeMore.length ? (
            <>
              <Catalogue
                ref={appendCatalogueRef}
                onAppend={onAppend_.bind(null, element.seeMore, 'before')}
                onPaste={onPaste.bind(null, element.seeMore, 'before')}
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
                onPaste={onPaste.bind(null, element.seeMore, 'after')}
              />
            </>
          ) : (
            <div className="oak-foldable-content-empty">
              <Catalogue
                ref={appendCatalogueRef}
                onAppend={onAppend_.bind(null, element.seeMore, 'after')}
                onPaste={onPaste.bind(null, element.seeMore, 'after')}
              />
            </div>
          )}
        </div>
      </Droppable>
      <div className="oak-foldable-section-title">
        <Text
          name="core.components.foldable.sectionsTitle.seeLess"
          default="Label when expanded"
        />
      </div>
      <Droppable
        disabled={element.seeLess.length > 0}
        onDrop={onDropElement.bind(null, element.seeLess)}
      >
        <div className="oak-foldable-content">
          { element?.seeLess.length ? (
            <>
              <Catalogue
                ref={appendCatalogueRef}
                onAppend={onAppend_.bind(null, element.seeLess, 'before')}
                onPaste={onPaste.bind(null, element.seeLess, 'before')}
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
                onPaste={onPaste.bind(null, element.seeLess, 'after')}
              />
            </>
          ) : (
            <div className="oak-foldable-content-empty">
              <Catalogue
                ref={appendCatalogueRef}
                onAppend={onAppend_.bind(null, element.seeLess, 'after')}
                onPaste={onPaste.bind(null, element.seeLess, 'after')}
              />
            </div>
          )}
        </div>
      </Droppable>
      <div className="oak-foldable-section-title">
        <Text
          name="core.components.foldable.sectionsTitle.content"
          default="Content"
        />
      </div>
      <Droppable
        disabled={element.content.length > 0}
        onDrop={onDropElement.bind(null, element.content)}
      >
        <div className="oak-foldable-content">
          { element?.content.length ? (
            <>
              <Catalogue
                ref={appendCatalogueRef}
                onAppend={onAppend_.bind(null, element.content, 'before')}
                onPaste={onPaste.bind(null, element.content, 'before')}
              />
              {element?.content?.map(elt => (
                <Element
                  key={elt.id}
                  element={elt}
                  parent={element.content}
                />
              ))}
              <Catalogue
                ref={appendCatalogueRef}
                onAppend={onAppend_.bind(null, element.content, 'after')}
                onPaste={onPaste.bind(null, element.content, 'after')}
              />
            </>
          ) : (
            <div className="oak-foldable-content-empty">
              <Catalogue
                ref={appendCatalogueRef}
                onAppend={onAppend_.bind(null, element.content, 'after')}
                onPaste={onPaste.bind(null, element.content, 'after')}
              />
            </div>
          )}
        </div>
      </Droppable>
    </div>
  );
};

Foldable.options = options;
Foldable.settings = settings;

export default Foldable;
