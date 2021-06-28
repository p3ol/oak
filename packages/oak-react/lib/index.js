import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@poool/junipero-utils';
import { render, useOptions, useBuilder, useElement } from '@poool/oak';

export { useOptions, useBuilder, useElement };

export const Builder = forwardRef(({
  options = {},
  value,
  containerProps,
  onChange,
  onImageUpload,
  className,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const builderRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    builderRef,
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
    <div
      className={classNames('oak-react-wrapper', className)}
      { ...containerProps }
      ref={innerRef}
    />
  );
});
