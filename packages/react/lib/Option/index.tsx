import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type MutableRefObject,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { type Boundary } from '@floating-ui/react';
import {
  type TooltipRef,
  type TooltipProps,
  Tooltip,
  classNames,
} from '@junipero/react';

import type { OakRef } from '../types';
import { useBuilder } from '../hooks';
import Icon from '../Icon';

export interface OptionProps extends ComponentPropsWithoutRef<'a'> {
  iconClassName?: string;
  option?: {
    icon: string | ReactNode | (() => ReactNode | ReactNode)
  };
  renderIcon?: () => ReactNode;
  draggable?: boolean;
  name?: ReactNode | JSX.Element;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  tooltipProps?: Partial<TooltipProps>;
}

export interface OptionRef extends OakRef {
  innerRef: MutableRefObject<HTMLElement>;
  tooltipRef: MutableRefObject<TooltipRef>;
}

const Option = forwardRef<OptionRef, OptionProps>(({
  className,
  iconClassName,
  option,
  renderIcon,
  draggable,
  name,
  onClick,
  tooltipProps,
  ...rest
}, ref) => {
  const { rootRef, rootBoundary, floatingsRef } = useBuilder();
  const innerRef = useRef<HTMLElement>();
  const tooltipRef = useRef<TooltipRef>();

  useImperativeHandle(ref, () => ({
    isOak: true,
    innerRef,
    tooltipRef,
  }), [innerRef.current]);

  const floatingOptions = useMemo<{ boundary: Boundary }>(() => ({
    boundary: (rootBoundary as MutableRefObject<any>)?.current ||
      rootRef?.current,
  }), []);

  const onClick_ = (e: MouseEvent<HTMLAnchorElement>) => {
    tooltipRef?.current?.close();
    onClick?.(e);
  };

  const inner = (
    <a
      { ...rest }
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
          className={classNames('!oak-text-lg', iconClassName)}
          children={typeof option?.icon === 'function'
            ? option?.icon?.() : option?.icon}
        />
      ) }
    </a>
  );

  return name ? (
    <Tooltip
      container={floatingsRef.current || '.oak'}
      ref={(r: TooltipRef) => {
        tooltipRef.current = r;
        innerRef.current = r?.handleRef?.current;
      }}
      floatingOptions={floatingOptions}
      text={name}
      { ...tooltipProps }
    >
      { inner }
    </Tooltip>
  ) : inner;
});

Option.displayName = 'Option';

export default Option;
