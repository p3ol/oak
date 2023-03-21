import {
  Children,
  cloneElement,
  forwardRef,
  useMemo,
  useReducer,
  useImperativeHandle,
} from 'react';
// import { createPortal } from 'react-dom';
import { mockState, classNames } from '@junipero/react';
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
  const { rootRef } = useBuilder();
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
        limiter: limitShift(),
        ...floatingSettings.shift || {},
      })] : []),
      ...(floatingSettings?.autoPlacement?.enabled !== false ? [autoPlacement({
        boundary: rootRef?.current,
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

  const renderForm = () => state.visible && (
    <div
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
      data-placement={context.placement}
      ref={floating}
      {...getFloatingProps()}
    >
      { slideInDownMenu((
        <Form
          element={element}
          component={component}
          placement={context.placement}
          onSave={close}
          onCancel={close}
        />
      ), { opened: state.opened, onExited: onAnimationExit }) }
    </div>
  );

  const child = Children.only(children);

  return (
    <>
      { child && cloneElement(child, {
        ref: r => { reference(r?.isOak ? r.innerRef.current : r); },
        className: classNames(
          child.props.className,
          { 'oak-opened': state.opened }
        ),
        ...getReferenceProps({
          onClick: child.props.onClick,
        }),
      }) }
      {/* { options.settingsContainer || _settingsHolderRef
        ? createPortal(
          renderForm(),
          options.settingsContainer || _settingsHolderRef
        )
        : renderForm()} */}
      { renderForm() }
    </>
  );
});

Editable.displayName = 'Editable';

export default Editable;
