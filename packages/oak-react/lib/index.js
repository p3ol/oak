import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@poool/junipero-utils';
import { Builder, useOptions, useBuilder, useElement } from '@poool/oak';

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

  useImperativeHandle(ref, () => ({
    innerRef,
    builderRef,
  }));

  return (
    <div
      className={classNames('oak-react-wrapper', className)}
      { ...containerProps }
      ref={innerRef}
    >
      <Builder
        ref={builderRef}
        { ...options }
        { ...rest }
        content={value}
        events={{
          ...options.events,
          ...rest.events,
          onChange,
          onImageUpload,
        }}
      />
    </div>
  );
});

export { Builder_ as Builder };
