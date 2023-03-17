import {
  forwardRef,
  useImperativeHandle,
  useReducer,
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
} from '@floating-ui/react';

import { useBuilder, useOptions } from '../../hooks';
import Icon from '../Icon';
import Text from '../Text';

const Catalogue = forwardRef(({
  placement = 'bottom',
  onToggle = () => {},
  onAppend = () => {},
  onPaste = () => {},
}, ref) => {
  const { components = [], getComponent } = useBuilder();
  const { otherTabEnabled } = useOptions();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
    clipboard: null,
  });
  const { x, y, reference, floating, strategy, context } = useFloating({
    open: state.opened,
    onOpenChange: o => o ? open() : close(),
    middleware: [
      offset(16),
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
  }));

  const open = () => {
    dispatch({ opened: true });
    onToggle({ opened: true });

    checkClipboard();
  };

  const checkClipboard = async () => {
    let clipboard;

    try {
      const element = JSON.parse(
        await globalThis.navigator.clipboard.readText()
      );

      if (getComponent(element.type)) {
        clipboard = element;
      }
    } catch (e) {}

    dispatch({ clipboard });
  };

  const close = () => {
    dispatch({ opened: false, clipboard: null });
    onToggle({ opened: false });
  };

  const toggle = e => {
    e.preventDefault();

    if (state.opened) {
      close();
    } else {
      open();
    }
  };

  const getGroups = () =>
    components.filter(c =>
      c.type === 'group' && (otherTabEnabled !== false || c.id !== 'other')
    );

  const renderComponents = group => {
    if (!group || (otherTabEnabled === false && group.id === 'other')) {
      return null;
    }

    let components_ = []
      .concat(group.components)
      .concat(components
        .filter(c => c.group === group.id).map(c => c.component));

    if (otherTabEnabled === false && group.id === 'core') {
      components_ = components_
        .concat(components.find(c => c.id === 'other')?.components || [])
        .concat(components
          .filter(c => c.group === 'other').map(c => c.component));
    }

    return (
      <div className="oak-components">
        { components_.map((c, i) => (
          <div
            key={c.id || i}
            className={classNames(
              'oak-component',
              'oak-component-' + (c.id || 'unknown')
            )}
          >
            <a href="#" draggable={false} onClick={onAppend_.bind(null, c)}>
              <div className="oak-component-icon">
                { typeof c.icon === 'function'
                  ? c.icon({ component: c, className: 'oak-icons' })
                  : <Icon>{ c.icon }</Icon>
                }
              </div>
              <span><Text>{ c.name }</Text></span>
            </a>
          </div>
        )) }
      </div>
    );
  };

  const onAppend_ = (component, e) => {
    e?.preventDefault();
    onAppend(component);
  };

  return (
    <div
      className={classNames(
        'oak-catalogue',
        { 'oak-opened': state.opened },
      )}
    >
      <a
        ref={reference}
        className="oak-handle"
        draggable={false}
        { ...getReferenceProps() }
      >
        <span className="oak-handle-inner"><Icon>add</Icon></span>
      </a>

      { state.opened && (
        <div
          ref={floating}
          className="oak-popover"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          data-placement={placement}
          { ...getFloatingProps() }
        >
          <div className="oak-groups">
            <Tabs>
              { getGroups().map((g, i) => (
                <Tab key={i} title={<Text>{ g.name }</Text>}>
                  { renderComponents(g) }
                </Tab>
              )) }
            </Tabs>
            { state.clipboard && (
              <a
                onClick={onPaste.bind(null, state.clipboard)}
                className="oak-clipboard"
              >
                <Icon>content_paste</Icon>
                <Text
                  name="core.pasteFromClipboard"
                  default="Paste from clipboard"
                />
              </a>
            ) }
          </div>
        </div>
      ) }
    </div>
  );
});

export default Catalogue;
