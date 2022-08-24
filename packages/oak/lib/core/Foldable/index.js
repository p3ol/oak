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

  const onDivide = (index, isBefore, part) => {
    element[part]?.splice(isBefore ? index : index + 1, 0, {
      content: [],
      id: uuid(),
      style: {},
      type: 'col',
    });

    setElement(element, { content: element.content, seeMore: element.seeMore });
  };

  const onRemoveCol = (index, part) => {
    if (element[part]?.length > 1) {
      element[part]?.splice(index, 1);
      setElement(element, {
        content: element.cols,
        seeMore: element.seeMore,
        seeLess: element.seeLess,
      });
    }
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
        { element?.cols?.map((col, i) => (
          <Col
            key={i}
            element={col}
            onPrepend={onDivide.bind(null, i, true, 'cols')}
            onAppend={onDivide.bind(null, i, false, 'cols')}
            onRemove={onRemoveCol.bind(null, i, 'cols')}
          />
        )) }
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
        { element?.seeMore?.map((col, i) => (
          <Col
            key={i}
            element={col}
            onPrepend={onDivide.bind(null, i, true, 'seeMore')}
            onAppend={onDivide.bind(null, i, false, 'seeMore')}
            onRemove={onRemoveCol.bind(null, i, 'seeMore')}
          />
        )) }
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
        { element?.seeLess?.map((col, i) => (
          <Col
            key={i}
            element={col}
            onPrepend={onDivide.bind(null, i, true, 'seeLess')}
            onAppend={onDivide.bind(null, i, false, 'seeLess')}
            onRemove={onRemoveCol.bind(null, i, 'seeLess')}
          />
        )) }
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
