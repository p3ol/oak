import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { render } from '@poool/oak/dist/react/esm/index.js';

export const Builder = forwardRef(({ options, ...rest }, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  useEffect(() => {
    render(innerRef.current, options);
  }, []);

  return (
    <div { ...rest } ref={innerRef} />
  );
});
