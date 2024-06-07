import {
  type ComponentPropsWithoutRef,
  forwardRef,
} from 'react';
import { classNames } from '@junipero/react';

const Icon = forwardRef<HTMLElement, ComponentPropsWithoutRef<any>>(({
  className,
  children,
  ...rest
}, ref) =>
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
