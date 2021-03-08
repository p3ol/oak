import { mockState, classNames } from '@poool/junipero-utils';
import React, { useReducer, useState } from 'react';
import { usePopper } from 'react-popper';
import { useEventListener } from '@poool/junipero-hooks';

import Option from '../Option';

import styles from './index.styl';

export default ({ globalEventsTarget = global, children }) => {
  const [popper, setPopper] = useState();
  const [reference, setReference] = useState();
  const [state, dispatch] = useReducer(mockState, {
    placement: 'bottom-end',
    opened: false,
  });

  useEventListener('click', e => {
    onClickOutside_(e);
  }, globalEventsTarget);

  const onClickOutside_ = e => {
    if (!popper || !reference) {
      return;
    }

    //TODO: improve ref handling
    if (
      reference !== e.target.parentElement.parentElement &&
      !popper.contains(e.target) &&
      popper !== e.target
    ) {
      dispatch({ opened: false });
    }
  };

  const { styles: popperStyles, attributes } = usePopper(reference, popper, {
    placement: 'left-start',
    strategy: 'fixed',

    positionFixed: true,

    modifiers: [
      ...[],
      {
        name: 'offset',
        options: {
          offset: [0, -24],
        },
      },
    ],
  });

  return (
    <>
      <div ref={setReference} className={styles.edit}>
        <Option
          option={{ icon: 'edit' }}
          className={classNames(styles.option, styles.edit)}
          onClick={() => dispatch({ opened: !state.opened })}
        />
      </div>
      { state.opened &&
          <div
            ref={setPopper}
            style={{ ...popperStyles.popper, zIndex: 999, position: 'fixed' }}
            {...attributes.popper}
            data-placement={'bottom'}
            className={styles.popper}
          >
            <div className={styles.top}>
              <a
                href="#"
                onClick={() => dispatch({ opened: !state.opened })}
              >
                <span className="material-icons" >
                  edit
                </span>
              </a>
              <span>col options</span>

            </div>
            <div className={styles.flex}>
              {children}
            </div>
          </div>
      }
    </>
  );
};
