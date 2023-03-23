import { useRef } from 'react';
import { Draggable, classNames } from '@junipero/react';

import Option from './Option';
import Text from './Text';

export const DRAG_OPTION = {
  render: ({ element, elementInnerRef, editableRef, className }) => {
    const optionRef = useRef();

    const onDrag = e => {
      optionRef.current?.tooltipRef?.current?.close();

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

    const onMouseDown = () => {
      editableRef.current?.forceClose();
    };

    const onClick = e => {
      e.preventDefault();
    };

    return (
      <Draggable
        ref={optionRef}
        onBeforeDragStart={onDrag}
        data={element}
      >
        <Option
          onMouseDown={onMouseDown}
          onClick={onClick}
          option={{ icon: 'pause' }}
          className={classNames(className, 'oak-drag-handle')}
          name={<Text name="core.tooltips.move" default="Move" />}
        />
      </Draggable>
    );
  },
};
