import {
  Children,
  cloneElement,
  forwardRef,
  useMemo,
  useReducer,
  useImperativeHandle,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { mockState, classNames, ensureNode } from '@junipero/react';
import { slideInDownMenu } from '@junipero/transitions';
import {
  useFloating,
  useInteractions,
  useClick,
  offset,
  autoUpdate,
  shift,
  limitShift,
  autoPlacement,
} from '@floating-ui/react';

import { useBuilder } from '../hooks';
import Form from './Form';

const Editable = forwardRef(({
  children,
  element,
  component,
  onToggle,
}, ref) => {
  const innerRef = useRef();
  const { rootRef, floatingsRef } = useBuilder();
  // const options = useOptions();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
    visible: false,
  });
  const floatingSettings = useMemo(() => (
    (typeof component?.settings?.floatingSettings === 'function'
      ? component.settings.floatingSettings({ optionButtonElement: reference })
      : component?.settings?.floatingSettings) || {}
  ), [component]);
  const { x, y, reference, floating, strategy, context } = useFloating({
    open: state.opened,
    onOpenChange: o => o ? open() : close(),
    whileElementsMounted: autoUpdate,
    placement: floatingSettings.placement || 'bottom',
    middleware: [
      offset(5),
      ...(floatingSettings?.shift?.enabled !== false ? [shift({
        boundary: rootRef?.current,
        rootBoundary: rootRef?.current,
        limiter: limitShift(),
        ...floatingSettings.shift || {},
      })] : []),
      ...(floatingSettings?.autoPlacement?.enabled !== false ? [autoPlacement({
        boundary: rootRef?.current,
        rootBoundary: rootRef?.current,
        allowedPlacements: ['bottom', 'top'],
        ...floatingSettings.autoPlacement || {},
      })] : []),
      ...floatingSettings.middleware || [],
    ],
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
  ]);

  useImperativeHandle(ref, () => ({
    open,
    close,
    toggle,
    isOak: true,
    innerRef,
  }));

  const open = () => {
    dispatch({ opened: true, visible: true });
    onToggle?.({ opened: true });
  };

  const close = () => {
    dispatch({ opened: false });
    onToggle?.({ opened: false });
  };

  const toggle = () =>
    state.opened ? close() : open();

  const onAnimationExit = () => {
    dispatch({ visible: false });
  };

  const child = Children.only(children);

  return (
    <>
      { child && cloneElement(child, {
        ref: r => { reference(r?.isOak ? r.innerRef.current : r); },
        className: classNames(
          child.props.className,
          { opened: state.opened }
        ),
        ...getReferenceProps({
          onClick: child.props.onClick,
        }),
      }) }
      { state.visible && createPortal((
        <div
          className="editable"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          data-placement={context.placement}
          ref={ref => {
            floating(ref?.isOak ? ref?.innerRef.current : ref);
            innerRef.current = ref;
          }}
          {...getFloatingProps()}
        >
          { slideInDownMenu((
            <Form
              element={element}
              component={component}
              placement={context.placement}
              onSave={close}
              onCancel={close}
              editableRef={innerRef}
            />
          ), { opened: state.opened, onExited: onAnimationExit }) }
        </div>
      ), ensureNode(floatingsRef.current)) }
    </>
  );
});

Editable.displayName = 'Editable';

export default Editable;
