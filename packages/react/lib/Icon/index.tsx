import { type ReactNode, type Ref, forwardRef } from 'react';
import { classNames } from '@junipero/react';

interface IconProps {
  className?: string;
  children?: ReactNode;
}

const Icon = forwardRef(({
  className,
  children,
  ...rest
}: IconProps, ref: Ref<HTMLElement>) =>
  typeof children === 'function' ? (children as Function)({ ref }) : (
    <i
      className={classNames('icon junipero-icons', className)}
      children={children}
      ref={ref}
      { ...rest }
    />
  ));

Icon.displayName = 'Icon';

export default Icon;
