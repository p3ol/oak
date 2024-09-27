import { ComponentPropsWithoutRef, DragEvent, MouseEvent, MutableRefObject, useRef, useState } from 'react';
import { Draggable, DraggableRef, classNames } from '@junipero/react';
import type { ComponentOptionObject, ElementObject } from '@oakjs/core';

import type { EditableRef } from './Editable';
import Option, { OptionRef } from './Option';
import Text from './Text';
import { ReactComponentOptionObject } from './types';

export interface DragOptionProps extends ComponentPropsWithoutRef<'a'> {
  element: ElementObject | ElementObject[];
  elementInnerRef: MutableRefObject<HTMLElement>;
  editableRef: MutableRefObject<EditableRef>;
}

export const DragOption = ({
  element, elementInnerRef, editableRef, className,
}: DragOptionProps) => {
  const optionRef = useRef<DraggableRef>();
  const [hasTooltip, setHasTooltip] = useState(true);

  const onBeforeDragStart = (e: DragEvent) => {
    setHasTooltip(false);
    // optionRef.current?.tooltipRef?.current?.close();

    // Elements with the DRAG_OPTION (like row) are not directly draggable,
    // so they don't benefit from junipero's Draggable classes
    // We have to manually add the `dragging` class to the element before
    // generating the drag image
    // We can't use the `dragImage` prop of the Draggable component either
    // because it would rely on useEffect and would rerender the Draggable
    // before being able to set the drag image
    const beforeClassName = elementInnerRef.current.className;
    elementInnerRef.current.className = classNames(
      elementInnerRef.current?.className,
      'dragging',
    );
    e.dataTransfer.setDragImage(elementInnerRef.current, 0, 0);
    elementInnerRef.current.className = beforeClassName;
  };

  const onDragEnd = () => {
    setHasTooltip(true);
  };

  const onMouseDown = () => {
    editableRef.current?.forceClose();
    setHasTooltip(false);
  };

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <Draggable
      ref={optionRef}
      onBeforeDragStart={onBeforeDragStart}
      onDragEnd={onDragEnd}
      data={element}
    >
      <Option
        onMouseDown={onMouseDown}
        onClick={onClick}
        option={{ icon: 'pause' }}
        className={classNames(className, 'oak-drag-handle')}
        name={<Text name="core.tooltips.move" default="Move" />}
        tooltipProps={{ disabled: !hasTooltip }}
      />
    </Draggable>
  );
};

export const dragOption = (): ComponentOptionObject => ({
  render: (props: DragOptionProps) => <DragOption {...props} />,
});

export const collapseOption = (): ReactComponentOptionObject => ({

  render: ({ className, element }) => {
    const [collapsed, setCollapsed] = useState(element.collapsed ?? false);

    const onClick = () => {
      element.collapsed = !collapsed;
      setCollapsed(!collapsed);
    };

    return (
      <Option
        onClick={onClick}
        option={{ icon: collapsed ? 'expand_more' : 'expand_less' }}
        className={classNames(className)}
        name={(
          <Text
            name={`core.tooltips.expand.${collapsed ? 'more' : 'less'}`}
            default={collapsed ? 'Expand' : 'Collapse'}
          />
        )}
      />
    );
  },
});

export const backgroundColorOption = (): ReactComponentOptionObject => ({
  render: ({ element = {} }) =>
    (element.styles?.backgroundColor || element.styles?.backgroundImage) && (
      <div
        className={classNames(
          'oak-order-last oak-ml-2 oak-rounded-full oak-w-[15px]',
          'oak-h-[15px] oak-bg-no-repeat oak-bg-center oak-bg-cover',
        )}
        style={{
          backgroundColor: element.styles?.backgroundColor,
          ...element.styles?.backgroundImage && {
            backgroundImage: `url(${element.styles?.backgroundImage.url})`,
          },
        }}
      />
    ),
});
