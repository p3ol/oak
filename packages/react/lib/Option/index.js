import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Tooltip, classNames } from '@junipero/react';

import { useBuilder } from '../hooks';
import Icon from '../Icon';

const Option = forwardRef(({
  className,
  option,
  renderIcon,
  draggable,
  name,
  onClick,
  ...props
}, ref) => {
  const { rootRef } = useBuilder();
  const innerRef = useRef();
  const tooltipRef = useRef();

  useImperativeHandle(ref, () => ({
    isOak: true,
    innerRef,
    tooltipRef,
  }), [innerRef.current]);

  const floatingOptions = useMemo(() => ({
    boundary: rootRef?.current,
  }), []);

  const onClick_ = e => {
    tooltipRef.current?.close();
    onClick?.(e);
  };

  const inner = (
    <a
      { ...props }
      onClick={onClick_}
      href="#"
      draggable={draggable ?? false}
      className={classNames(
        'option oak-flex oak-items-center oak-justify-center',
        className
      )}
    >
      { renderIcon ? renderIcon() : (
        <Icon
          className="!oak-text-lg"
          children={typeof option?.icon === 'function'
            ? option?.icon?.() : option?.icon}
        />
      ) }
    </a>
  );

  return name ? (
    <Tooltip
      container={rootRef?.current || '.oak'}
      ref={r => {
        tooltipRef.current = r;
        innerRef.current = r?.handleRef?.current;
      }}
      floatingOptions={floatingOptions}
      text={name}
    >
      { inner }
    </Tooltip>
  ) : inner;
});

Option.displayName = 'Option';

export default Option;
