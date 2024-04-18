import {
  Children,
  cloneElement,
  forwardRef,
  useMemo,
  useReducer,
  useImperativeHandle,
  useRef,
  ComponentPropsWithRef,
  ReactNode,
  MutableRefObject,
  ForwardedRef,
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
  flip,
  limitShift,
  autoPlacement,
} from '@floating-ui/react';

import { useBuilder } from '../hooks';
import Form from './Form';
import { Component, ComponentObject, ElementObject } from '../../../core/lib/types';

export declare interface EditableRef {
  isOak: boolean;
}

export declare interface EditableProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  element?: ElementObject;
  component?: ComponentObject | Component;
  onToggle?(props: { opened: boolean });
  ref?: MutableRefObject<EditableRef>;
}
const Editable = forwardRef(({
  children,
  element,
  component,
  onToggle,
}: EditableProps, ref) => {
  const innerRef = useRef<any>();
  const { rootBoundary, floatingsRef } = useBuilder();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
    visible: false,
  });
  const floatingSettings = useMemo(() => (
    (typeof component?.settings?.floatingSettings === 'function'
      ? component.settings.floatingSettings()
      : component?.settings?.floatingSettings) || {}
  ), [component]);
  const { x, y, refs, strategy, context } = useFloating({
    open: state.opened,
    onOpenChange: o => o ? open() : close(),
    whileElementsMounted: autoUpdate,
    placement: floatingSettings.placement || 'bottom',
    middleware: [
      offset(5),
      ...(floatingSettings?.shift?.enabled !== false ? [shift({
        boundary: (rootBoundary as MutableRefObject<HTMLElement>)?.current,
        limiter: limitShift(),
        ...floatingSettings.shift || {},
      })] : []),
      ...(floatingSettings?.autoPlacement?.enabled !== false ? [autoPlacement({
        boundary: (rootBoundary as MutableRefObject<HTMLElement>)?.current,
        allowedPlacements: ['bottom'],
        ...floatingSettings.autoPlacement || {},
      })] : []),
      ...(floatingSettings?.flip?.enabled !== false ? [flip({
        boundary: (rootBoundary as MutableRefObject<HTMLElement>)?.current,
        ...floatingSettings.flip || {},
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
    forceClose,
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

  const forceClose = () => {
    dispatch({ opened: false, visible: false });
  };

  const toggle = () =>
    state.opened ? close() : open();

  const onAnimationExit = () => {
    dispatch({ visible: false });
  };

  const child = Children.only(children) as JSX.Element;

  return (
    <>
      { child && cloneElement(child, {
        ref: r => { refs.setReference(r?.isOak ? r.innerRef.current : r); },
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
            refs.setFloating((ref as any)?.isOak
              ? (ref as any)?.innerRef.current : ref);//TODO fix it
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
      ), ensureNode(floatingsRef.current) as any) }
      {/*TODO FIX UPPER LINE */}
    </>
  );
});

Editable.displayName = 'Editable';

export default Editable;
