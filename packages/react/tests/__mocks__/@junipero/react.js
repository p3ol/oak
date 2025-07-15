import { useEffect } from 'react';

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
