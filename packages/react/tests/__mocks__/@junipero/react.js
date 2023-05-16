import { useEffect } from 'react';

/* eslint-disable import/export */
const Transition = ({ in: inProp, onExited, children }) => {
  useEffect(() => {
    if (!inProp) {
      onExited?.();
    }
  }, [inProp]);

  return inProp ? children : null;
};

export * from '@junipero/react';

export { Transition };
