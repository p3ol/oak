import { ComponentPropsWithRef, ForwardedRef, forwardRef } from 'react';
import { classNames } from '@junipero/react';

export declare interface IconProps extends ComponentPropsWithRef<any> {}

const Icon = forwardRef((
  { className, children, ...rest }: IconProps, ref: ForwardedRef<any>
) =>
  typeof children === 'function' ? children({ ref }) : (
    <i
      className={classNames('icon junipero-icons', className)}
      children={children}
      ref={ref}
      { ...rest }
    />
  ));

Icon.displayName = 'Icon';

export default Icon;
