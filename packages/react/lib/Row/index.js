import { Droppable, classNames, omit } from '@junipero/react';

import { useBuilder } from '../../hooks';
import Col from './Col';
import options from './index.options';
import settings from './index.settings';

const Row = ({
  element,
  parent,
  ...rest
}) => {
  const builder = useBuilder();

  const onDivide = (index, isBefore) => {
    element.cols.splice(isBefore ? index : index + 1, 0, {
      content: [],
      id: builder.generateId(),
      style: {},
      type: 'col',
    });

    builder.setElement(element, { cols: element.cols });
  };

  const onRemoveCol = index => {
    element.cols.splice(index, 1);
    builder.setElement(element, { cols: element.cols });

    if (element.cols.length <= 0) {
      builder.removeElement(element, { parent });
    }
  };

  const onDropElement = (position, sibling) => {
    builder.moveElement(sibling, element, { parent, position });
  };

  return (
    <div { ...omit(rest, ['builder', 'component']) }>
      <Droppable onDrop={onDropElement.bind(null, 'before')}>
        <div className="oak-drop-zone oak-before" />
      </Droppable>
      <div
        className={classNames(
          'oak-row-content',
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
            onPrepend={onDivide.bind(null, i, true)}
            onAppend={onDivide.bind(null, i, false)}
            onRemove={onRemoveCol.bind(null, i)}
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
