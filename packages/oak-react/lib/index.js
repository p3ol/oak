import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
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
  const [builder, setBuilder] = useState();

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  useEffect(() => {
    builder?.setContent?.(value);
  }, [value]);

  useEffect(() => {
    const builder_ = render(innerRef.current, {
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
    setBuilder(builder_);
  }, [innerRef.current]);

  return (
    <div { ...containerProps } ref={innerRef} />
  );
});
