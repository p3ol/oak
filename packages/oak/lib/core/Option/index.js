import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { Tooltip, classNames } from '@poool/junipero';

import { useBuilder } from '../../hooks';
import Icon from '../Icon';

export default forwardRef(({
  className,
  option,
  renderIcon,
  draggable,
  name,
  onClick,
  ...props
}, ref) => {
  const { oakRef } = useBuilder();
  const innerRef = useRef();
  const tooltipRef = useRef();

  useImperativeHandle(ref, () => ({
    isOak: true,
    innerRef,
    tooltipRef,
  }), [innerRef.current]);

  const popperOptions = useMemo(() => ({
    modifiers: [{
      name: 'preventOverflow',
      enabled: true,
      options: {
        boundary: oakRef?.current,
      },
    }],
  }), []);

  const onClick_ = e => {
    tooltipRef.current?.close();
    onClick?.(e);
  };

  const inner = (
    <a
      { ...props }
      onClick={onClick_}
      ref={innerRef}
      href="#"
      draggable={draggable ?? false}
      className={classNames('oak-option', className)}
    >
      { renderIcon
        ? renderIcon?.()
        : typeof option?.icon === 'function'
          ? option?.icon?.()
          : <Icon>{ option?.icon }</Icon>
      }
    </a>
  );

  return name ? (
    <Tooltip
      container={oakRef?.current || '.oak'}
      ref={r => {
        tooltipRef.current = r;
        innerRef.current = r?.innerRef?.current;
      }}
      popperOptions={popperOptions}
      text={name}
    >
      { inner }
    </Tooltip>
  ) : inner;
});
