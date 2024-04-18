import { ComponentPropsWithRef, forwardRef, MutableRefObject, ReactNode, useImperativeHandle, useMemo, useRef } from 'react';
import { Tooltip, TooltipRef, classNames } from '@junipero/react';

import { useBuilder } from '../hooks';
import Icon from '../Icon';
import { Component, ComponentObject, ElementObject } from '../../../core/lib/types';
import Builder from '../../../core/lib/Builder';

export declare interface OptionObject {
  icon?: ReactNode | JSX.Element;
  render?(props: {
    option: OptionObject;
    className: string;
    element: ElementObject;
    elementInnerRef: MutableRefObject<any>;
    editableRef: MutableRefObject<any>;
    parent: Array<ElementObject>;
    component: ComponentObject | Component;
    builder: Builder;
    index: number;
  }): ReactNode | JSX.Element;
}

export declare type OptionRef = {
  isOak: boolean;
  innerRef: MutableRefObject<any>;
  tooltipRef: MutableRefObject<any>;
};

export declare interface OptionProps extends ComponentPropsWithRef<any> {
  className?: string;
  iconClassName?: string;
  option: OptionObject,
  draggable?: boolean;
  name?: ReactNode | JSX.Element;
  renderIcon?(): ReactNode | JSX.Element;
}

const Option = forwardRef(({
  className,
  iconClassName,
  option,
  renderIcon,
  draggable,
  name,
  onClick,
  tooltipProps,
  ...props
}: OptionProps, ref: MutableRefObject<OptionRef>) => {
  const { rootRef, rootBoundary, floatingsRef } = useBuilder();
  const innerRef = useRef();
  const tooltipRef = useRef<TooltipRef>();

  useImperativeHandle(ref, () => ({
    isOak: true,
    innerRef,
    tooltipRef,
  }), [innerRef.current]);

  const floatingOptions = useMemo(() => ({
    boundary: (rootBoundary as MutableRefObject<any>)?.current ||
      rootRef?.current,
    rootBoundary: (rootBoundary as MutableRefObject<any>)?.current ||
      rootRef?.current,
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
          className={classNames('!oak-text-lg', iconClassName)}
          children={typeof option?.icon === 'function'
            ? (option?.icon as Function)?.() : option?.icon}
        />
      ) }
    </a>
  );

  return name ? (
    <Tooltip
      container={floatingsRef.current || '.oak'}
      ref={r => {
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
