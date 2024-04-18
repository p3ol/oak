import { Droppable, omit, classNames } from '@junipero/react';
import { ComponentPropsWithoutRef } from 'react';

import { useBuilder } from '../../hooks';
import Text from '../../Text';
import Container from '../../Container';
import { Component, ComponentObject, ElementObject } from '../../../../core/lib/types';

declare interface FoldableProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
  component?: ComponentObject | Component;
  parentComponent?: ComponentObject | Component;
  parent?: Array<ElementObject>;
  depth?: number;
}

const Foldable = ({
  component,
  parentComponent,
  element,
  parent,
  className,
  depth = 0,
  ...rest
}: FoldableProps) => {
  const { builder } = useBuilder();

  const onDropElement = (
    position: 'before' | 'after',
    sibling: ElementObject,
  ) => {
    if (parentComponent?.disallow?.includes?.(sibling.type)) {
      return;
    }

    builder.moveElement(sibling, element, { parent, position });
  };

  return (
    <div
      { ...omit(rest, ['builder']) }
      className={classNames(
        'wrapper',
        depth % 2 === 0 ? 'even' : 'odd',
        className,
      )}
      data-depth={depth}
    >
      <Droppable onDrop={onDropElement.bind(null, 'before')}>
        <div className="drop-zone before" />
      </Droppable>
      <div className="sections oak-flex oak-flex-col oak-gap-4 oak-p-4">
        <div className="section">
          <div
            className="title junipero secondary !oak-text-alternate-text-color"
          >
            <Text name="core.components.foldable.sectionsTitle.seeMore">
              Label when collapsed
            </Text>
          </div>
          <Container
            depth={depth + 1}
            element={element}
            content={element.seeMore}
            component={component}
          />
        </div>
        <div className="section">
          <div
            className="title junipero secondary !oak-text-alternate-text-color"
          >
            <Text name="core.components.foldable.sectionsTitle.seeLess">
              Label when expanded
            </Text>
          </div>
          <Container
            depth={depth + 1}
            element={element}
            content={element.seeLess}
            component={component}
          />
        </div>
        <div className="section">
          <div
            className="title junipero secondary !oak-text-alternate-text-color"
          >
            <Text name="core.components.foldable.sectionsTitle.content">
              Content
            </Text>
          </div>
          <Container
            depth={depth + 1}
            element={element}
            content={element.content}
            component={component}
          />
        </div>
      </div>
      <Droppable onDrop={onDropElement.bind(null, 'after')}>
        <div className="drop-zone after" />
      </Droppable>
    </div>
  );
};

Foldable.displayName = 'Foldable';

export default Foldable;
