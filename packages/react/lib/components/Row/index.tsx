import type {
  ComponentObject,
  ComponentOverride,
  ElementObject,
} from '@oakjs/core';
import {
  type ComponentPropsWithoutRef,
  type Key,
  useCallback,
  useMemo,
} from 'react';
import { Droppable, classNames, omit } from '@junipero/react';

import { useBuilder } from '../../hooks';
import Col from '../Col';
import Text from '../../Text';

export interface RowProps extends ComponentPropsWithoutRef<'div'> {
  element: ElementObject;
  parent: Array<ElementObject>;
  parentComponent: ComponentObject;
  depth?: number;
}

const Row = ({
  element,
  parent,
  parentComponent,
  className,
  depth = 0,
  ...rest
}: RowProps) => {
  const { builder, addons } = useBuilder();
  const parentOverride = useMemo(() => (
    builder.getOverride('component', parentComponent?.id) as ComponentOverride
  ), [parentComponent, builder, addons]);

  const onDivide = (index: number, isBefore: boolean) => {
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

    builder.setElement(
      element.id as string,
      { cols: element.cols },
      { element }
    );
  };

  const onRemoveCol = (index: number) => {
    if (element.cols?.length > 0) {
      element.cols.splice(index, 1);
    }

    if (element.cols?.length <= 0) {
      builder.removeElement(element.id as string, { parent });
    } else {
      builder.setElement(
        element.id as string,
        { cols: element.cols },
        { element }
      );
    }
  };

  const onDropElement = useCallback((
    position: 'before' | 'after',
    sibling: ElementObject
  ) => {
    if (
      parentComponent?.disallow?.includes?.(sibling.type) ||
      parentOverride?.disallow?.includes?.(sibling.type)
    ) {
      return;
    }

    builder.moveElement(sibling, element, { parent, position });
  }, [builder, element, parent, parentComponent, parentOverride]);

  return (
    <>
      { !element.collapsed && (
        <div
          { ...omit(rest, ['builder', 'component']) }
          className={classNames(
            'wrapper',
            depth % 2 === 0 ? 'even' : 'odd',
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
                : /col/.test(element.settings?.flexDirection)
                  ? 'oak-items-stretch' : 'oak-items-start',
              element.settings?.justifyContent &&
              'oak-justify-' + element.settings.justifyContent,
            )}
          >
            { element?.cols?.map((col: ElementObject, i: Key) => (
              <Col
                key={i}
                depth={depth}
                element={col}
                parent={element.cols}
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
      )}
    </>
  );
};

Row.displayName = 'Row';

export default Row;
