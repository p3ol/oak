import {
  forwardRef,
  useImperativeHandle,
  useReducer,
  useState,
} from 'react';
import {
  Tabs,
  Tab,
  classNames,
  mockState,
  useEventListener,
} from '@poool/junipero';
import { usePopper } from 'react-popper';

import { useBuilder, useOptions } from '../../hooks';
import Icon from '../Icon';
import Text from '../Text';

export default forwardRef(({
  globalEventsTarget = global,
  placement = 'bottom',
  popperOptions = {},
  onToggle = () => {},
  onAppend = () => {},
  onPaste = () => {},
}, ref) => {
  const { components = [], getComponent, oakRef } = useBuilder();
  const { otherTabEnabled } = useOptions();
  const [popper, setPopper] = useState();
  const [reference, setReference] = useState();
  const [arrow, setArrow] = useState();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
    clipboard: null,
  });
  const { styles: popperStyles, attributes } = usePopper(reference, popper, {
    placement,
    modifiers: [
      ...(popperOptions.modifiers || []),
      {
        name: 'preventOverflow',
        enabled: true,
        options: {
          boundary: oakRef?.current,
        },
      },
      { name: 'arrow', options: { element: arrow } },
      {
        name: 'offset',
        options: {
          offset: [arrow && /-(start|end)/.test(placement) ? -5 : 0, 16],
        },
      },
    ],
  });

  useEventListener('click', e => {
    onClickOutside_(e);
  }, globalEventsTarget);

  useImperativeHandle(ref, () => ({
    open,
    close,
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

  const onClickOutside_ = e => {
    if (!popper || !reference) {
      return;
    }

    if (
      !reference.contains(e.target) &&
      reference !== e.target &&
      !popper.contains(e.target) &&
      popper !== e.target
    ) {
      close();
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
        ref={setReference}
        className="oak-handle"
        onClick={toggle}
        draggable={false}
        href="#"
      >
        <span className="oak-handle-inner"><Icon>add</Icon></span>
      </a>

      { state.opened && (
        <div
          ref={setPopper}
          style={popperStyles.popper}
          className="oak-popover"
          {...attributes.popper}
          data-placement={placement}
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
          <div
            ref={setArrow}
            style={popperStyles.arrow}
            className="oak-arrow"
          />
        </div>
      ) }
    </div>
  );
});
