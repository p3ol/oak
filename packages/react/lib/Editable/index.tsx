import {
  type ComponentPropsWithoutRef,
  type MutableRefObject,
  type ReactElement,
  type Ref,
  Children,
  cloneElement,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import type { ComponentObject, ComponentSettingsFormObject, ElementObject } from '@oakjs/core';
import { createPortal } from 'react-dom';
import { mockState, classNames, ensureNode } from '@junipero/react';
import { slideInDownMenu } from '@junipero/transitions';
import {
  autoPlacement,
  autoUpdate,
  flip,
  limitShift,
  offset,
  shift,
  useClick,
  useFloating,
  useInteractions,
} from '@floating-ui/react';

import Form from './Form';
import { useBuilder } from '../hooks';

interface EditableProps extends ComponentPropsWithoutRef<any> {
  children: ReactElement;
  element: ElementObject;
  component: ComponentObject;
  onToggle?: (state: { opened: boolean }) => void;
}

type FloatingRef = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  opened: boolean;
  isOak: boolean;
  innerRef: MutableRefObject<any>;
};

const Editable = forwardRef(({
  children,
  element,
  component,
  onToggle,
}: EditableProps, ref) => {
  const innerRef: MutableRefObject<any> = useRef<Ref<HTMLElement>>();
  const { rootBoundary, floatingsRef } = useBuilder();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
    visible: false,
  });
  const floatingSettings = useMemo(() => (
    (typeof (component?.settings as ComponentSettingsFormObject
    )?.floatingSettings === 'function'
      ? ((component.settings as ComponentSettingsFormObject
      ).floatingSettings as Function)()
      : (component?.settings as ComponentSettingsFormObject
      )?.floatingSettings) || {}
  ), [component]);
  const { x, y, refs, strategy, context } = useFloating({
    open: state.opened,
    onOpenChange: o => o ? open() : close(),
    whileElementsMounted: autoUpdate,
    placement: floatingSettings.placement || 'bottom',
    middleware: [
      offset(5),
      ...(floatingSettings?.shift?.enabled !== false ? [shift({
        boundary: (rootBoundary as MutableRefObject<any>)?.current,
        limiter: limitShift(),
        ...floatingSettings.shift || {},
      })] : []),
      ...(floatingSettings?.autoPlacement?.enabled !== false ? [autoPlacement({
        boundary: (rootBoundary as MutableRefObject<any>)?.current,
        allowedPlacements: ['bottom'],
        ...floatingSettings.autoPlacement || {},
      })] : []),
      ...(floatingSettings?.flip?.enabled !== false ? [flip({
        boundary: (rootBoundary as MutableRefObject<any>)?.current,
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

  const child = Children.only(children);

  return (
    <>
      { child && cloneElement(child, {
        ref: (r: FloatingRef) => {
          refs.setReference(r?.isOak ? r.innerRef.current : r);
        },
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
          ref={(ref: FloatingRef | HTMLDivElement) => {
            refs.setFloating((ref as FloatingRef)?.isOak
              ? (ref as FloatingRef)?.innerRef.current
              : ref
            );
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
      ), ensureNode(floatingsRef.current) as any) } {/*TODO update junipero*/}
    </>
  );
});

Editable.displayName = 'Editable';

export default Editable;
