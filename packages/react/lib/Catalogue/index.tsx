import type {
  ComponentObject,
  ComponentOverride,
  ElementObject,
} from '@oakjs/core';
import {
  type MouseEvent,
  type RefObject,
  type ComponentPropsWithoutRef,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import {
  Tabs,
  Tab,
  classNames,
  mockState,
  ensureNode,
} from '@junipero/react';
import { slideInDownMenu } from '@junipero/transitions';
import {
  type UseFloatingOptions,
  type Boundary,
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  offset,
  shift,
  flip,
} from '@floating-ui/react';

import type { OakRef } from '../types';
import { useBuilder } from '../hooks';
import Icon from '../Icon';
import Text from '../Text';

export declare interface CatalogueRef extends OakRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
  opened: boolean;
  innerRef: RefObject<HTMLDivElement>;
}

export declare interface CatalogueProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onToggle'> {
  ref?: RefObject<CatalogueRef>;
  component?: ComponentObject;
  placement?: string;
  floatingOptions?: UseFloatingOptions & {
    boundary?: Boundary;
  };
  onToggle?(props: { opened: boolean }): void;
  onAppend?(component: ComponentObject): void;
  onPaste?(clipboardData: ElementObject): void;
}

export declare interface CatalogueState {
  opened: boolean;
  clipboard?: ElementObject;
}

const Catalogue = ({
  ref,
  component,
  className,
  placement = 'bottom',
  floatingOptions,
  onToggle,
  onAppend,
  onPaste,
  ...rest
}: CatalogueProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const { builder, floatingsRef, addons } = useBuilder();
  const override = useMemo(() => (
    builder.getOverride('component', component?.id) as ComponentOverride
  ), [builder, component, addons]);
  const [state, dispatch] = useReducer<
    CatalogueState, [Partial<CatalogueState>]
  >(mockState, {
    opened: false,
    clipboard: null,
  });
  const { x, y, refs, strategy, context } = useFloating({
    open: state.opened,
    onOpenChange: o => o ? open() : close(),
    middleware: [
      offset(16),
      flip({
        boundary: floatingOptions?.boundary ||
          floatingOptions?.elements?.reference,
      }),
      shift({
        boundary: floatingOptions?.boundary ||
          floatingOptions?.elements?.reference,
      }),
    ],
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  useImperativeHandle(ref, () => ({
    open,
    close,
    toggle,
    opened: state.opened,
    isOak: true,
    innerRef,
  }));

  const open = () => {
    dispatch({ opened: true });
    onToggle?.({ opened: true });

    checkClipboard();
  };

  const checkClipboard = async () => {
    let clipboard;

    try {
      const element = JSON.parse(
        await globalThis.navigator.clipboard.readText()
      );

      if (Array.isArray(element)) {
        clipboard = element.filter(e => builder.getComponent(e.type));
      } else if (builder.getComponent(element.type)) {
        clipboard = element;
      }
    } catch (e) {}

    dispatch({ clipboard });
  };

  const close = () => {
    dispatch({ opened: false, clipboard: null });
    onToggle?.({ opened: false });
  };

  const toggle = () => {
    if (state.opened) {
      close();
    } else {
      open();
    }
  };

  const onAppend_ = (
    component: ComponentObject,
    e: MouseEvent<HTMLAnchorElement>,
  ) => {
    e?.preventDefault();
    onAppend?.(component);
  };

  const availableGroups = useMemo(() => (
    builder.getAvailableComponents()
  ), [builder, addons]);

  const groups = useMemo(() => (
    availableGroups
      .filter(g =>
        g.usable !== false &&
        (builder?.getOverride('component', g.id) as ComponentOverride)
          ?.usable !== false
      )
      .map(g => ({
        ...g,
        components: g.components.filter((c: ComponentObject) => (
          c.usable !== false &&
          (builder?.getOverride('component', c.id) as ComponentOverride)
            ?.usable !== false &&
          (!component || !component.disallow ||
            !component.disallow.includes(c.id)) &&
          (!override || !override.disallow ||
            !override.disallow.includes(c.id))
        )),
      }))
      .filter(g => g.components.length)
  ), [availableGroups, component, override]);

  return (
    <div
      { ...rest }
      ref={innerRef}
      className={classNames(
        'catalogue',
        { opened: state.opened },
        className,
      )}
    >
      <a
        ref={refs.setReference}
        className={classNames(
          'handle oak-inline-flex oak-items-center',
          'oak-justify-center',
        )}
        draggable={false}
        { ...getReferenceProps() }
      >
        <Icon>add</Icon>
      </a>

      { floatingsRef?.current && createPortal(slideInDownMenu((
        <div
          ref={refs.setFloating}
          className="catalogue-menu"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          data-placement={placement}
          { ...getFloatingProps() }
        >
          <div className="groups">
            <Tabs>
              { groups.map(group => (
                <Tab
                  key={group.id}
                  title={<Text>{ group.name }</Text>}
                >
                  <div className="group oak-grid oak-grid-cols-2 oak-gap-2">
                    { group.components.map((component: ComponentObject) => (
                      <a
                        key={component.id}
                        href="#"
                        draggable={false}
                        onClick={onAppend_.bind(null, component)}
                        className={classNames(
                          'component',
                          'component-' + component.id,
                          'oak-flex oak-items-center oak-px-2 oak-py-1',
                          'oak-gap-2 junipero'
                        )}
                      >
                        <Icon
                          className="!oak-text-2xl"
                          children={typeof component.icon === 'function'
                            ? component.icon.bind(null, component)
                            : component.icon}
                        />
                        <span className="name">
                          <Text>{ component.name as string }</Text>
                        </span>
                      </a>
                    )) }
                  </div>
                </Tab>
              )) }
            </Tabs>

            { state.clipboard && (
              <a
                onClick={onPaste?.bind(null, state.clipboard)}
                className={classNames(
                  'clipboard junipero oak-flex oak-items-center oak-px-2',
                  'oak-py-1 oak-gap-2',
                )}
              >
                <Icon>appearences</Icon>
                <Text name="core.pasteFromClipboard">
                  Paste from clipboard
                </Text>
              </a>
            ) }
          </div>
        </div>
      ),
      { opened: state.opened }), ensureNode(floatingsRef?.current)) }
    </div>
  );
};

Catalogue.displayName = 'Catalogue';

export default Catalogue;
