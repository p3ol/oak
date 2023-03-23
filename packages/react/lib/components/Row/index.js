import { Droppable, classNames, omit } from '@junipero/react';

import { useBuilder } from '../../hooks';
import Col from '../Col';
import options from './index.options';
import settings from './index.settings';

const Row = ({
  element,
  parent,
  className,
  ...rest
}) => {
  const { builder } = useBuilder();

  const onDivide = (index, isBefore) => {
    if (!element.cols || element.cols.length <= 0) {
      element.cols = [{
        content: [],
        id: builder.generateId(),
        style: {},
        type: 'col',
      }];
    }

    element.cols.splice(isBefore ? index : index + 1, 0, {
      content: [],
      id: builder.generateId(),
      style: {},
      type: 'col',
    });

    builder.setElement(element, { cols: element.cols });
  };

  const onRemoveCol = index => {
    if (element.cols?.length > 0) {
      element.cols.splice(index, 1);
    }

    if (element.cols?.length <= 0) {
      builder.removeElement(element, { parent });
    } else {
      builder.setElement(element, { cols: element.cols });
    }
  };

  const onDropElement = (position, sibling) => {
    builder.moveElement(sibling, element, { parent, position });
  };

  return (
    <div
      { ...omit(rest, ['builder', 'component']) }
      className={classNames(
        'wrapper',
        className,
      )}
    >
      <Droppable onDrop={onDropElement.bind(null, 'before')}>
        <div className="drop-zone before" />
      </Droppable>
      <div
        className={classNames(
          'row-content oak-flex oak-flex-wrap oak-w-full oak-gap-2',
          element.settings?.flexDirection &&
            'oak-flex-' + element.settings.flexDirection,
          element.settings?.alignItems
            ? 'oak-items-' + element.settings.alignItems
            : 'oak-items-start',
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
        <div className="drop-zone after" />
      </Droppable>
    </div>
  );
};

Row.options = options;
Row.settings = settings;

export default Row;
