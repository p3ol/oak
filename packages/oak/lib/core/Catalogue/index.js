import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useReducer,
  useState,
} from 'react';
import { usePopper } from 'react-popper';
import { mockState } from '@poool/junipero-utils';
import { useEventListener } from '@poool/junipero-hooks';

import { AppContext } from '../../contexts';

import styles from './index.styl';

export default forwardRef(({
  globalEventsTarget = global,
}, ref) => {
  const { components = [] } = useContext(AppContext);
  const [popper, setPopper] = useState();
  const [reference, setReference] = useState();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
  });

  const { styles: popperStyles, attributes } = usePopper(reference, popper, {
    placement: 'right',
  });

  useEventListener('click', e => {
    onClickOutside_(e);
  }, globalEventsTarget);

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const open = reference_ => {
    dispatch({ opened: true });
    setReference(reference_);
  };

  const close = () =>
    dispatch({ opened: false });

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

  return state.opened && (
    <div
      ref={setPopper}
      style={popperStyles.popper}
      className={styles.catalogue}
      {...attributes.popper}
    >

    </div>
  );
});
