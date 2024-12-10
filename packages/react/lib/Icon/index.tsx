import type {
  ComponentPropsWithRef,
} from 'react';
import { classNames } from '@junipero/react';

const Icon = ({
  ref,
  className,
  children,
  ...rest
}: ComponentPropsWithRef<any>) =>
  typeof children === 'function' ? (children as Function)({ ref }) : (
    <i
      className={classNames('icon junipero-icons', className)}
      children={children}
      ref={ref}
      { ...rest }
    />
  );

Icon.displayName = 'Icon';

export default Icon;
