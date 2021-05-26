import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { render, useOptions, useBuilder } from '@poool/oak';

export { useOptions, useBuilder };

export const Builder = forwardRef(({
  options = {},
  value,
  containerProps,
  onChange,
  onImageUpload,
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
      ...rest,
      content: value,
      events: {
        ...options.events,
        ...rest.events,
        onChange,
        onImageUpload,
      },
    });
  }, [innerRef.current]);

  return (
    <div { ...containerProps } ref={innerRef} />
  );
});
