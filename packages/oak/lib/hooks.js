import { useContext, useState, useEffect } from 'react';

import { AppContext, ElementContext } from './contexts';

export const useOptions = () => {
  return useContext(AppContext).options || {};
};

export const useBuilder = () => {
  const {
    components = [],
    content = [],
    ...rest
  } = useContext(AppContext);

  return {
    components,
    content,
    ...rest,
  };
};

export const useElement = () => {
  return useContext(ElementContext);
};

export const usePostMountEffect = (cb, changes = []) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) {
      cb();
    } else {
      setMounted(true);
    }
  }, [mounted].concat(changes));
};
