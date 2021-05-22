import { useEffect, useRef } from 'react';

import oak from './';

export default { title: 'oak' };

export const basicConfig = () => {
  const containerRef = useRef();

  useEffect(() => {
    oak.render(containerRef.current, {
      // debug: true,
      content: [
        { type: 'row' },
        { type: 'test' },
      ],
    });
  }, []);

  return (<div ref={containerRef} id="container" />);
};
