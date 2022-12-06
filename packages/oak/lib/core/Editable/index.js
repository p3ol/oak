import {
  Children,
  cloneElement,
  forwardRef,
  useMemo,
  useReducer,
  useEffect,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import { mockState, classNames } from '@junipero/react';
import {
  useFloating,
  useInteractions,
  useClick,
  offset,
  autoUpdate,
  shift,
  limitShift,
  autoPlacement,
} from '@floating-ui/react-dom-interactions';

import { useBuilder, useOptions } from '../../hooks';
import Form from './Form';

export default forwardRef(({
  children,
  element,
  component,
}, ref) => {
  const { _settingsHolderRef, overrides, oakRef } = useBuilder();
  const options = useOptions();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
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
        boundary: oakRef?.current,
        limiter: limitShift(),
        ...floatingSettings.shift || {},
      })] : []),
      ...(floatingSettings?.autoPlacement?.enabled !== false ? [autoPlacement({
        boundary: oakRef?.current,
        allowedPlacements: ['bottom', 'top'],
        ...floatingSettings.autoPlacement || {},
      })] : []),
      ...floatingSettings.middleware || [],
    ],
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
  ]);

  useEffect(() => {
    close();
  }, [overrides]);

  useImperativeHandle(ref, () => ({
    open,
    close,
    toggle,
  }));

  const open = () => {
    dispatch({ opened: true });
  };

  const close = () => {
    dispatch({ opened: false });
  };

  const toggle = () =>
    state.opened ? close() : open();

  const renderForm = () => (
    <Form
      element={element}
      component={component}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
      placement={context.placement}
      onSave={close}
      onCancel={close}
      ref={floating}
      {...getFloatingProps()}
    />
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
      { state.opened
        ? options.settingsContainer || _settingsHolderRef
          ? createPortal(
            renderForm(),
            options.settingsContainer || _settingsHolderRef
          )
          : renderForm()
        : null }
    </>
  );
});
