import { useRef, useState } from 'react';
import { Draggable, classNames } from '@junipero/react';

import Option from './Option';
import Text from './Text';

export const DragOption = ({
  element, elementInnerRef, editableRef, className,
}) => {
  const optionRef = useRef();
  const [hasTooltip, setHasTooltip] = useState(true);

  const onBeforeDragStart = e => {
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

  const onClick = e => {
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

export const dragOption = () => ({
  render: props => <DragOption {...props} />,
});

export const backgroundColorOption = () => ({
  render: ({ element = {} }: { element: { [_: string]: any}}) =>//TODO fix it
    (element?.styles?.backgroundColor || element.styles?.backgroundImage) && (
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
