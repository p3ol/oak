import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { render, useOptions, useBuilder, useElement } from '@poool/oak';

export { useOptions, useBuilder, useElement };

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

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  useEffect(() => {
    builderRef.current?.setContent?.(value);
  }, [value]);

  useEffect(() => {
    builderRef.current = render(innerRef.current, {
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
