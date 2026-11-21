import type { ComponentPropsWithRef } from 'react';
import { classNames } from '@junipero/react';

const Icon = ({
  ref,
  className,
  children,
  ...rest
}: ComponentPropsWithRef<any>) =>
  typeof children === 'function' ? children({ ref }) : (
    <i
      className={classNames('icon junipero-icons', className)}
      ref={ref}
      { ...rest }
    >
      { children }
    </i>
  );

Icon.displayName = 'Icon';

export default Icon;
