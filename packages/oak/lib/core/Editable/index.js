import { createPortal } from 'react-dom';
import {
  Children,
  cloneElement,
  forwardRef,
  useReducer,
  useState,
  useImperativeHandle,
} from 'react';
import { mockState, classNames } from '@poool/junipero';
import { usePopper } from 'react-popper';

import { useBuilder, useOptions } from '../../hooks';
import Form from './Form';

export default forwardRef(({
  children,
  element,
  component,
}, ref) => {
  const { _settingsHolderRef } = useBuilder();
  const options = useOptions();
  const [popper, setPopper] = useState();
  const [reference, setReference] = useState();

  const [state, dispatch] = useReducer(mockState, {
    opened: false,
  });

  const { styles: popperStyles, attributes } = usePopper(reference, popper, {
    ...((typeof component?.settings?.popperSettings === 'function'
      ? component?.settings?.popperSettings({ optionButtonElement: reference })
      : component?.settings?.popperSettings
    ) || {
      modifiers: [{
        name: 'preventOverflow',
        options: {
          boundary: true,
        },
      }, {
        name: 'offset',
        options: {
          offset: [0, 5],
        },
      }],
    }),
  });

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
      ref={setPopper}
      popper={popper}
      element={element}
      component={component}
      styles={popperStyles}
      attributes={attributes}
      onSave={close}
      onCancel={close}
    />
  );

  return (
    <>
      { children && cloneElement(Children.only(children), {
        ref: setReference,
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
