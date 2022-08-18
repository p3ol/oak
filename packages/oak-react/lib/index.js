import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@poool/junipero-utils';
import { useOptions, useBuilder, useElement, render } from '@poool/oak';

export { useOptions, useBuilder, useElement };

const Builder_ = forwardRef(({
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
  useEffect(() => {
    const ref = render(innerRef.current, {
      ref: builderRef,
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

    builderRef.current = ref;

    return () => {
      ref?.destroy();
    };
  }, [options]);
  useImperativeHandle(ref, () => ({
    innerRef,
    builderRef,
  }));

  return (
    <div
      className={classNames('oak-react-wrapper', className)}
      { ...containerProps }
      ref={innerRef}
    />
  );
});

export { Builder_ as Builder };
