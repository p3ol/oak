import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useReducer,
  useState,
} from 'react';
import { usePopper } from 'react-popper';
import { classNames, mockState } from '@poool/junipero-utils';
import { useEventListener } from '@poool/junipero-hooks';

import { AppContext } from '../../contexts';

import styles from './index.styl';

export default forwardRef(({
  globalEventsTarget = global,
  placement = 'bottom',
  popperOptions = {},
  onToggle = () => {},
  onAppend = () => {},
}, ref) => {
  const { components = [] } = useContext(AppContext);
  const [popper, setPopper] = useState();
  const [reference, setReference] = useState();
  const [arrow, setArrow] = useState();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
    currentTab: null,
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
      reference !== e.target &&
      !popper.contains(e.target) &&
      popper !== e.target
    ) {
      close();
    }
  };

  const getGroups = () =>
    components.filter(c => c.type === 'group');

  const renderComponents = () => {
    const group = state.currentTab || getGroups()[0];

    if (!group) {
      return null;
    }

    return (

      <div className={styles.components} >
        { group.components.map(c => (
          <button
            className={styles.item}
            key={c.id}
            onClick={onAppend_.bind(null, c)}>
            <i className="material-icons">{c.icon}</i> <span>{c.name}</span>
          </button>

        )) }
      </div>
    );
  };

  const onGroupSelect = (group, e) => {
    e?.preventDefault();
    dispatch({ currentTab: group });
  };

  const onAppend_ = (component, e) => {
    e?.preventDefault();
    onAppend(component);
  };

  return (
    <div
      className={classNames(
        styles.catalogue,
        { [styles.opened]: state.opened },
      )}
    >
      <a
        ref={setReference}
        className={styles.handle}
        onClick={toggle}
      />
      { state.opened && (
        <div
          ref={setPopper}
          style={popperStyles.popper}
          className={styles.popover}
          {...attributes.popper}
          data-placement={placement}
        >
          <div className={styles.groups}>
            <ul className={styles.tabs}>
              { getGroups().map((g, i) => (
                <li
                  key={g.id}
                  className={classNames(
                    styles.tab,
                    {
                      [styles.active]: (!state.currentTab && i === 0) ||
                        state.currentTab === g,
                    }
                  )}
                >
                  <a href="#" onClick={e => {
                    e.preventDefault();
                    onGroupSelect(g);
                  }}>
                    { g.name }
                  </a>
                </li>
              )) }
            </ul>

            <div className={styles.group}>
              { renderComponents() }
            </div>
          </div>
          <div
            ref={setArrow}
            style={popperStyles.arrow}
            className={styles.arrow}
          />
        </div>
      ) }
    </div>
  );
});
