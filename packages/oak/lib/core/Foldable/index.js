import { v4 as uuid } from 'uuid';
import { classNames, omit } from '@poool/junipero-utils';

import { useBuilder } from '../../hooks';
import Col from '../Col';
import Droppable from '../Droppable';
import options from '../Row/index.options';
import settings from '../Row/index.settings';

const Row = ({
  element,
  parent,
  ...rest
}) => {
  const { setElement, moveElement } = useBuilder();

  const onDivide = (index, isBefore, isOnContent) => {
    const side = isOnContent ? 'content' : 'seeMore';
    element[side]?.cols.splice(isBefore ? index : index + 1, 0, {
      content: [],
      id: uuid(),
      style: {},
      type: 'col',
    });

    setElement(element, { content: element.content, seeMore: element.seeMore });
  };

  const onRemoveCol = (index, isOnContent) => {
    const side = isOnContent ? 'content' : 'seeMore';

    if (element[side]?.cols.length > 1) {
      element[side]?.cols.splice(index, 1);
      setElement(element, { content: element.content, seeMore: element.seeMore });
    }
  };

  const onDropElement = (position, data, isOnContent) => {
    const side = isOnContent ? 'content' : 'seeMore';

    moveElement(data, element, { parent, position });
  };

  return (
    <div
      { ...omit(rest, ['builder']) }
      style={element.style}
    >
      <div>See more content section</div>
      <Droppable onDrop={onDropElement.bind(null, 'before', true)}>
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
        { element?.content?.cols?.map((col, i) => (
          <Col
            key={i}
            element={col}
            onPrepend={onDivide.bind(null, i, true, true)}
            onAppend={onDivide.bind(null, i, false, true)}
            onRemove={onRemoveCol.bind(null, i, true)}
          />
        )) }
      </div>
      <Droppable onDrop={onDropElement.bind(null, 'after', true)}>
        <div className="oak-drop-zone oak-after" />
      </Droppable>
      <div>See More title section</div>
      <Droppable onDrop={onDropElement.bind(null, 'before', false)}>
        <div className="oak-drop-zone oak-before" />
      </Droppable>
      <div
        className={classNames(
          'oak-foldable-seeMore',
          element.settings?.flexDirection &&
            'oak-direction-' + element.settings.flexDirection,
          element.settings?.alignItems &&
            'oak-align-' + element.settings.alignItems,
          element.settings?.justifyContent &&
            'oak-justify-' + element.settings.justifyContent,
        )}
      >
        { element?.seeMore?.cols?.map((col, i) => (
          <Col
            key={i}
            element={col}
            onPrepend={onDivide.bind(null, i, true, false)}
            onAppend={onDivide.bind(null, i, false, false)}
            onRemove={onRemoveCol.bind(null, i, false)}
          />
        )) }
      </div>
      <Droppable onDrop={onDropElement.bind(null, 'after', false)}>
        <div className="oak-drop-zone oak-after" />
      </Droppable>
      <div>See less title section</div>
      <Droppable onDrop={onDropElement.bind(null, 'before', false)}>
        <div className="oak-drop-zone oak-before" />
      </Droppable>
      <div
        className={classNames(
          'oak-foldable-seeMore',
          element.settings?.flexDirection &&
            'oak-direction-' + element.settings.flexDirection,
          element.settings?.alignItems &&
            'oak-align-' + element.settings.alignItems,
          element.settings?.justifyContent &&
            'oak-justify-' + element.settings.justifyContent,
        )}
      >
        { element?.seeLess?.cols?.map((col, i) => (
          <Col
            key={i}
            element={col}
            onPrepend={onDivide.bind(null, i, true, false)}
            onAppend={onDivide.bind(null, i, false, false)}
            onRemove={onRemoveCol.bind(null, i, false)}
          />
        )) }
      </div>
      <Droppable onDrop={onDropElement.bind(null, 'after', false)}>
        <div className="oak-drop-zone oak-after" />
      </Droppable>
    </div>
  );
};

Row.options = options;
Row.settings = settings;

export default Row;
