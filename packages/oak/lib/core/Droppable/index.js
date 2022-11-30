import { Children, cloneElement, forwardRef, useState, useEffect } from 'react';
import { classNames } from '@junipero/react';

export default forwardRef(({
  className,
  children,
  disabled = false,
  onDrop,
  onDragOver,
  onDragLeave,
  ...rest
}, ref) => {
  const [dragging, setDragging] = useState(false);
  const [stack, setStack] = useState(0);
  const [draggingPos, setDraggingPos] = useState(null);

  useEffect(() => {
    if (stack <= 0) {
      setDragging(false);
    }
  }, [stack]);

  const onDragEnter_ = () => {
    if (disabled) {
      return;
    }

    setStack(stack + 1);
    setDragging(true);
  };

  const onDragLeave_ = e => {
    if (disabled) {
      return;
    }

    setStack(stack - 1);
    setDraggingPos(null);
    onDragLeave?.(e);
  };

  const onDrop_ = e => {
    if (disabled) {
      return;
    }

    setStack(0);
    setDragging(false);
    onDrop?.(JSON.parse(e.dataTransfer.getData('text')), draggingPos, e);
    e.preventDefault();
    setDraggingPos(null);
  };

  /* istanbul ignore next: cannot be tested */
  const onDragOver_ = e => {
    // const data = JSON.parse(e.dataTransfer.getData('text'));
    const targetRect = e.currentTarget.getBoundingClientRect();
    const targetMiddleY = targetRect?.top + targetRect?.height / 2;
    let draggingPosition;

    if (e.clientY >= targetMiddleY) {
      draggingPosition = 'after';
    } else if (e.clientY < targetMiddleY) {
      draggingPosition = 'before';
    }

    setDraggingPos(draggingPosition);
    e.preventDefault();
    onDragOver?.(e, draggingPosition);

    return false;
  };

  const child = Children.only(children);

  return cloneElement(child, {
    ...rest,
    ref,
    className: classNames(
      className,
      child.props.className,
      { 'drag-enter': !disabled && dragging },
      { 'drag-top': !disabled && dragging && draggingPos &&
      /* istanbul ignore next: cannot be tested */ draggingPos === 'before' },
      { 'drag-bottom': !disabled && dragging && draggingPos &&
      /* istanbul ignore next: cannot be tested */ draggingPos === 'after' },
    ),
    onDragEnter: onDragEnter_,
    onDragLeave: onDragLeave_,
    onDrop: onDrop_,
    onDragOver: onDragOver_,
  });
});
