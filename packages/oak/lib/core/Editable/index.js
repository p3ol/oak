import { createPortal } from 'react-dom';
import {
  Children,
  cloneElement,
  forwardRef,
  useReducer,
  useEffect,
  useImperativeHandle,
} from 'react';
import { mockState, classNames } from '@poool/junipero';
import {
  useFloating,
  offset,
  autoUpdate,
  autoPlacement,
} from '@floating-ui/react-dom';

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

  const { x, y, reference, floating, strategy, refs } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: 5 }),
      autoPlacement({
        boundary: oakRef?.current,
      }),
    ],
  });

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
      ref={floating}
      popper={refs.floating}
      element={element}
      component={component}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
      onSave={close}
      onCancel={close}
    />
  );

  return (
    <>
      { children && cloneElement(Children.only(children), {
        ref: r => reference(r?.isOak ? r.innerRef.current || r : r),
        className: classNames(
          Children.only(children).props.className,
          { 'oak-opened': state.opened }
        ),
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
