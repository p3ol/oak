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

import { useBuilder } from '../../hooks';
import Icon from '../Icon';

export default forwardRef(({
  globalEventsTarget = global,
  placement = 'bottom',
  popperOptions = {},
  onToggle = () => {},
  onAppend = () => {},
}, ref) => {
  const { components = [] } = useBuilder();
  const [popper, setPopper] = useState();
  const [reference, setReference] = useState();
  const [arrow, setArrow] = useState();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
  });

  const { styles: popperStyles, attributes } = usePopper(reference, popper, {
    placement,
    modifiers: [
      ...(popperOptions.modifiers || []),
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
  };

  const close = () => {
    dispatch({ opened: false });
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
    components.filter(c => c.type === 'group');

  const renderComponents = group => {
    if (!group) {
      return null;
    }

    return (
      <div className="oak-components">
        { group.components.map((c, i) => (
          <div key={c.id || i} className="oak-component">
            <a href="#" draggable={false} onClick={onAppend_.bind(null, c)}>
              { typeof c.icon === 'function' ? c.icon() : (
                <Icon className="oak-component-icon">{ c.icon }</Icon>
              ) }
              <span>{ c.name }</span>
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
                <Tab key={i} title={g.name}>
                  { renderComponents(g) }
                </Tab>
              )) }
            </Tabs>
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
