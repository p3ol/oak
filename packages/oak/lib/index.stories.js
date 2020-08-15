import React, { useEffect, useRef } from 'react';

import oak from './';

export default { title: 'oak' };

export const basicConfig = () => {
  const containerRef = useRef();

  useEffect(() => {
    oak.render(containerRef.current);
  }, []);

  return (<div ref={containerRef} id="container" />);
};
