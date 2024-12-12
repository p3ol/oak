import type {
  ComponentObject,
  ComponentSettingsFormObject,
  ElementObject,
} from '@oakjs/core';
import {
  type RefObject,
  type ReactElement,
  type MouseEvent,
  type ComponentPropsWithRef,
  Children,
  cloneElement,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import {
  mockState,
  classNames,
  ensureNode,
  omit,
} from '@junipero/react';
import { slideInDownMenu } from '@junipero/transitions';
import {
  type UseFloatingOptions,
  type Boundary,
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

import type { OakRef, SpecialComponentPropsWithRef } from '../types';
import type { EditableRef } from '.';
import { useBuilder } from '../hooks';
import Form from './Form';

export interface FloatingEditableProps
  extends SpecialComponentPropsWithRef<any, EditableRef> {
  children: ReactElement<ComponentPropsWithRef<any>>;
  element: ElementObject;
  component: ComponentObject;
  floatingOptions?: UseFloatingOptions & {
    boundary?: Boundary;
  };
  onToggle?: (state: { opened: boolean }) => void;
}

export declare interface FloatingRef extends OakRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
  opened: boolean;
  innerRef: RefObject<any>;
}

export declare interface FloatingEditableState {
  opened?: boolean;
  visible?: boolean;
}

const FloatingEditable = ({
  ref,
  children,
  floatingOptions,
  element,
  component,
  onToggle,
  setOpened,
  opened,
}: FloatingEditableProps) => {
  const innerRef = useRef<FloatingRef | HTMLDivElement>(null);
  const { rootBoundary, floatingsRef } = useBuilder();
  const [state, dispatch] = useReducer<
    FloatingEditableState, [Partial<FloatingEditableState>]
  >(mockState, {
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
    ...omit(floatingOptions || {}, ['boundary', 'middleware']),
    middleware: [
      offset(5),
      ...(floatingSettings?.shift?.enabled !== false ? [shift({
        boundary: floatingOptions?.boundary ||
          (rootBoundary as RefObject<any>)?.current,
        limiter: limitShift(),
        ...floatingSettings.shift || {},
      })] : []),
      ...(floatingSettings?.autoPlacement?.enabled !== false ? [autoPlacement({
        boundary: floatingOptions?.boundary ||
          (rootBoundary as RefObject<any>)?.current,
        ...floatingSettings.autoPlacement || {},
      })] : []),
      ...(floatingSettings?.flip?.enabled !== false ? [flip({
        boundary: floatingOptions?.boundary ||
          (rootBoundary as RefObject<any>)?.current,
        ...floatingSettings.flip || {},
      })] : []),
      ...floatingSettings.middleware || [],
      ...floatingOptions?.middleware || [],
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

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    (ref as RefObject<EditableRef>).current?.toggle();
    setOpened(opened);
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
          onClick,
        }),
      }) }
      { state.visible && createPortal((
        <div
          className="floating editable"
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
          { ...getFloatingProps() }
        >
          { slideInDownMenu((
            <Form
              element={element}
              component={component}
              placement={context.placement}
              onSave={close}
              onCancel={close}
              editableRef={ref as RefObject<EditableRef>}
            />
          ), { opened: state.opened, onExited: onAnimationExit }) }
        </div>
      ), ensureNode(floatingsRef.current)) }
    </>
  );
};

FloatingEditable.displayName = 'Editable';

export default FloatingEditable;
