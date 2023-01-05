import {
  forwardRef,
  useEffect,
  useLayoutEffect,
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

  useLayoutEffect(() => {
    // In order to avoid react diffing inside our own render tree
    const elmt = document.createElement('div');
    innerRef.current.appendChild(elmt);
    const ref = render(elmt, {
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

    return async () => {
      await ref?.destroy();
      elmt.remove();
    };
  }, []);

  useEffect(() => {
    builderRef.current?.setOptions({
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
  }, [options, onChange, onImageUpload]);

  useImperativeHandle(ref, () => ({
    innerRef,
    builderRef,
    setContent,
  }));

  const setContent = (...args) => {
    builderRef.current?.setContent(...args);
  };

  return (
    <div
      className={classNames('oak-react-wrapper', className)}
      { ...containerProps }
      ref={innerRef}
    />
  );
});

export { Builder_ as Builder };
