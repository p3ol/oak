import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { render, useOptions, useBuilder } from '@poool/oak';

export { useOptions, useBuilder };

export const Builder = forwardRef(({
  options = {},
  value,
  onChange,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const builderRef = useRef();

  useEffect(() => {
    builderRef.current?.setContent(value);
  }, [value]);

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  useEffect(() => {
    render(innerRef.current, {
      ...options,
      content: value,
      events: {
        ...options.events,
        onChange,
      },
    });
  }, [innerRef.current]);

  return (
    <div { ...rest } ref={innerRef} />
  );
});
