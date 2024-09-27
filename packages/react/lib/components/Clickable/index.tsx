import type {
  ComponentObject,
  ComponentOverride,
  ElementObject,
} from '@oakjs/core';
import { type ComponentPropsWithoutRef, useCallback, useMemo } from 'react';
import { Droppable, omit, classNames } from '@junipero/react';

import { useBuilder } from '../../hooks';
import Text from '../../Text';
import Container from '../../Container';

export interface ClickableProps extends ComponentPropsWithoutRef<'div'> {
  element: ElementObject;
  parent: Array<ElementObject>;
  component: ComponentObject;
  parentComponent: ComponentObject;
  depth?: number;
}

const Clickable = ({
  component,
  parentComponent,
  element,
  parent,
  className,
  depth = 0,
  ...rest
}: ClickableProps) => {
  const { builder, addons } = useBuilder();
  const override = useMemo(() => (
    builder.getOverride('component', component?.id) as ComponentOverride
  ), [builder, component, addons]);
  const parentOverride = useMemo(() => (
    builder.getOverride('component', parentComponent?.id) as ComponentOverride
  ), [builder, parentComponent, addons]);

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
  }, [
    builder, element, parent, component, override, parentComponent,
    parentOverride,
  ]);

  return (
    <>
      { !element.collapsed && (
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
                className={classNames(
                  'title junipero secondary',
                  '!oak-text-alternate-text-color'
                )}
              >
                <Text name="core.components.clickable.sectionsTitle.content">
                    Clickable content
                </Text>
              </div>
              <Container
                depth={depth + 1}
                element={element}
                content={element.content as ElementObject[]}
                component={component}
              />
            </div>
          </div>
          <Droppable onDrop={onDropElement.bind(null, 'after')}>
            <div className="drop-zone after" />
          </Droppable>
        </div>
      )}
    </>
  );
};

Clickable.displayName = 'Clickable';

export default Clickable;
