import { Children, cloneElement, forwardRef, useState } from 'react';
import { useTimeout, classNames } from '@junipero/react';

export default forwardRef(({
  className,
  children,
  disabled = false,
  data = {},
  dragImage,
  dragImageOffset = { x: 0, y: 0 },
  onDrag,
  onBeforeDragStart,
  onDragStart,
  onDragEnd,
  ...rest
}, ref) => {
  const [dragged, setDragged] = useState(false);
  const [dragAnimation, setDragAnimation] = useState(false);

  useTimeout(() => {
    if (dragAnimation) {
      setDragged(true);
      setDragAnimation(false);
    }
  }, 0, [dragAnimation]);

  const onDragStart_ = e => {
    if (disabled) {
      return;
    }

    onBeforeDragStart?.(e);

    const targetRect = e.currentTarget.getBoundingClientRect();

    try {
      e.dataTransfer.setData?.('text', JSON.stringify(data));

      if (dragImage) {
        e.dataTransfer.setDragImage(
          dragImage,
          dragImageOffset.x,
          dragImageOffset.y
        );
      }
    } catch (err) {}

    setDragAnimation(true);
    onDragStart?.(e, targetRect);
  };

  const onDragEnd_ = e => {
    if (disabled) {
      return;
    }

    setDragged(false);
    onDragEnd?.(e);
  };

  const onDrag_ = e => {
    if (disabled) {
      return;
    }

    onDrag?.(e);
  };

  const child = Children.only(children);

  return cloneElement(child, {
    ...rest,
    ref,
    className: classNames(
      className,
      child.props.className,
      {
        dragging: !disabled && dragAnimation,
        dragged: !disabled && dragged,
        draggable: !disabled,
      }
    ),
    draggable: !disabled,
    onDragStart: onDragStart_,
    onDrag: onDrag_,
    onDragEnd: onDragEnd_,
  });
});
