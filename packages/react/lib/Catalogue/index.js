import {
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import {
  Tabs,
  Tab,
  classNames,
  mockState,
} from '@junipero/react';
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  offset,
  shift,
} from '@floating-ui/react';

import { useBuilder } from '../hooks';
import Icon from '../Icon';
import Text from '../Text';

const Catalogue = forwardRef(({
  className,
  placement = 'bottom',
  onToggle,
  onAppend,
  onPaste,
}, ref) => {
  const innerRef = useRef();
  const { builder, rootRef } = useBuilder();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
    clipboard: null,
  });
  const { x, y, reference, floating, strategy, context } = useFloating({
    open: state.opened,
    onOpenChange: o => o ? open() : close(),
    middleware: [
      offset(16),
      shift({
        rootBoundary: rootRef?.current,
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

      if (builder.getComponent(element.type)) {
        clipboard = element;
      }
    } catch (e) {}

    dispatch({ clipboard });
  };

  const close = () => {
    dispatch({ opened: false, clipboard: null });
    onToggle?.({ opened: false });
  };

  const toggle = e => {
    e.preventDefault();

    if (state.opened) {
      close();
    } else {
      open();
    }
  };

  const onAppend_ = (component, e) => {
    e?.preventDefault();
    onAppend?.(component);
  };

  const groups = builder.getAvailableComponents();

  return (
    <div
      ref={innerRef}
      className={classNames(
        'catalogue',
        { opened: state.opened },
        className,
      )}
    >
      <a
        ref={reference}
        className={classNames(
          'handle oak-inline-flex oak-items-center',
          'oak-justify-center',
        )}
        draggable={false}
        { ...getReferenceProps() }
      >
        <i className="icon junipero-icons !oak-text-3xl">add</i>
      </a>

      { state.opened && (
        <div
          ref={floating}
          className="menu"
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
                <Tab key={group.id} title={<Text>{ group.name }</Text>}>
                  <div className="group oak-grid oak-grid-cols-2 oak-gap-2">
                    { group.components.map(component => (
                      <a
                        key={component.id}
                        href="#"
                        draggable={false}
                        onClick={onAppend_.bind(null, component)}
                        className={classNames(
                          'component',
                          'component-' + component.id,
                          'oak-flex oak-items-center oak-px-2 oak-py-1',
                          'oak-gap-2'
                        )}
                      >
                        <Icon
                          className="!oak-text-3xl"
                          children={typeof component.icon === 'function'
                            ? component.icon.bind(null, component)
                            : component.icon}
                        />
                        <span className="name">
                          <Text>{ component.name }</Text>
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
                  'clipboard oak-flex oak-items-center oak-px-2 oak-py-1',
                  'oak-gap-2',
                )}
              >
                <Icon>content_paste</Icon>
                <Text name="core.pasteFromClipboard">
                  Paste from clipboard
                </Text>
              </a>
            ) }
          </div>
        </div>
      ) }
    </div>
  );
});

Catalogue.displayName = 'Catalogue';

export default Catalogue;
