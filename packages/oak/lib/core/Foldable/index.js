import { classNames, omit } from '@poool/junipero-utils';
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
  const { moveElement, addElement, getText, depth } = useBuilder();
  const appendCatalogueRef = useRef();

  const onAppend_ = (parent, component) => {
    const elmt = component.construct?.() || {};
    addElement?.({
      ...elmt,
      content: typeof elmt.content === 'function'
        ? elmt.content(getText) : elmt.content,
    }, { parent, position: 'after' });
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
      <Droppable onDrop={onDropElement.bind(null, 'before')}>
        <div className="oak-drop-zone oak-before" />
      </Droppable>
      <div
        className={classNames(
          'oak-foldable-content',
          element.settings?.flexDirection &&
            'oak-direction-' + element.settings.flexDirection,
          element.settings?.alignItems &&
            'oak-align-' + element.settings.alignItems,
          element.settings?.justifyContent &&
            'oak-justify-' + element.settings.justifyContent,
        )}
      >
        <Droppable disabled={element.cols.length > 0} onDrop={onDropElement}>
          <>
            { element?.cols.length ? element?.cols?.map((elt, i) => (
              <Element
                key={i}
                element={elt}
                parent={element.cols}
              />
            )) : (
              <div className="oak-foldable-content-empty">
                <Catalogue
                  ref={appendCatalogueRef}
                  onAppend={onAppend_.bind(null, element.cols)}
                  onPaste={onPasteAfter_}
                />
              </div>
            )}
          </>
        </Droppable>
      </div>
      <Droppable onDrop={onDropElement.bind(null, 'after')}>
        <div className="oak-drop-zone oak-after" />
      </Droppable>
      <div>See More title section</div>
      <Droppable onDrop={onDropElement.bind(null, 'before')}>
        <div className="oak-drop-zone oak-before" />
      </Droppable>
      <div
        className={classNames(
          'oak-foldable-content',
          element.settings?.flexDirection &&
            'oak-direction-' + element.settings.flexDirection,
          element.settings?.alignItems &&
            'oak-align-' + element.settings.alignItems,
          element.settings?.justifyContent &&
            'oak-justify-' + element.settings.justifyContent,
        )}
      >
        { element?.seeMore.length ? element?.seeMore?.map((elt, i) => (
          <Element
            key={i}
            element={elt}
            parent={element.seeMore}
          />
        )) : (
          <Catalogue
            ref={appendCatalogueRef}
            onAppend={onAppend_.bind(null, element.seeMore)}
            onPaste={onPasteAfter_}
          />
        ) }
      </div>
      <Droppable onDrop={onDropElement.bind(null, 'after')}>
        <div className="oak-drop-zone oak-after" />
      </Droppable>
      <div>See less title section</div>
      <Droppable onDrop={onDropElement.bind(null, 'before')}>
        <div className="oak-drop-zone oak-before" />
      </Droppable>
      <div
        className={classNames(
          'oak-foldable-content',
          element.settings?.flexDirection &&
            'oak-direction-' + element.settings.flexDirection,
          element.settings?.alignItems &&
            'oak-align-' + element.settings.alignItems,
          element.settings?.justifyContent &&
            'oak-justify-' + element.settings.justifyContent,
        )}
      >
        { element?.seeLess.length ? element?.seeLess?.map((elt, i) => (
          <Element
            key={i}
            element={elt}
            parent={element.seeLess}
          />
        )) : (
          <Catalogue
            ref={appendCatalogueRef}
            onAppend={onAppend_.bind(null, element.seeLess)}
            onPaste={onPasteAfter_}
          />
        ) }

      </div>
      <Droppable onDrop={onDropElement.bind(null, 'after')}>
        <div className="oak-drop-zone oak-after" />
      </Droppable>
    </div>
  );
};

Row.options = options;
Row.settings = settings;

export default Row;
