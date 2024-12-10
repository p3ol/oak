import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type RefObject,
  type ReactNode,
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
  ref?: RefObject<OptionRef>;
  iconClassName?: string;
  option?: {
    icon: string | ReactNode | (() => ReactNode | ReactNode)
  };
  renderIcon?: () => ReactNode;
  draggable?: boolean;
  name?: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  tooltipProps?: Partial<TooltipProps>;
}

export interface OptionRef extends OakRef {
  innerRef: RefObject<HTMLElement>;
  tooltipRef: RefObject<TooltipRef>;
}

const Option = ({
  ref,
  className,
  iconClassName,
  option,
  renderIcon,
  draggable,
  name,
  onClick,
  tooltipProps,
  ...rest
}: OptionProps) => {
  const { rootRef, rootBoundary, floatingsRef } = useBuilder();
  const innerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<TooltipRef>(null);

  useImperativeHandle(ref, () => ({
    isOak: true,
    innerRef,
    tooltipRef,
  }), [innerRef.current]);

  const floatingOptions = useMemo<{ boundary: Boundary }>(() => ({
    boundary: (rootBoundary as RefObject<any>)?.current ||
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
};

Option.displayName = 'Option';

export default Option;
