import { useRef } from 'react';
import { Droppable, omit } from '@junipero/react';

import { useBuilder } from '../../hooks';
import Text from '../Text';
import Section from './Section';
import options from './index.options';
import settings from './index.settings';

const Foldable = ({
  element,
  parent,
  ...rest
}) => {
  const { moveElement, addElement, getText } = useBuilder();
  const appendCatalogueRef = useRef();

  const onAppend = (parent, position, component) => {
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

  const onParentDropElement = (position, data) => {
    moveElement(data, element, { parent, position });
  };

  return (
    <div { ...omit(rest, ['builder', 'component']) }>
      <Droppable onDrop={onParentDropElement.bind(null, 'before')}>
        <div className="oak-drop-zone oak-before" />
      </Droppable>
      <div className="oak-foldable-content">
        <Section
          title={(
            <Text
              name="core.components.foldable.sectionsTitle.seeMore"
              default="Label when collapsed"
            />
          )}
          content={element.seeMore}
          onDropElement={onDropElement.bind(null, element.seeMore)}
          onAppend={onAppend.bind(null, element.seeMore)}
          onPaste={onPaste.bind(null, element.seeMore)}
        />
        <Section
          title={(
            <Text
              name="core.components.foldable.sectionsTitle.seeLess"
              default="Label when expanded"
            />
          )}
          content={element.seeLess}
          onDropElement={onDropElement.bind(null, element.seeLess)}
          onAppend={onAppend.bind(null, element.seeLess)}
          onPaste={onPaste.bind(null, element.seeLess)}
        />
        <Section
          title={(
            <Text
              name="core.components.foldable.sectionsTitle.content"
              default="Content"
            />
          )}
          content={element.content}
          onDropElement={onDropElement.bind(null, element.content)}
          onAppend={onAppend.bind(null, element.content)}
          onPaste={onPaste.bind(null, element.content)}
        />
      </div>
      <Droppable onDrop={onParentDropElement.bind(null, 'after')}>
        <div className="oak-drop-zone oak-after" />
      </Droppable>
    </div>
  );
};

Foldable.options = options;
Foldable.settings = settings;

export default Foldable;
