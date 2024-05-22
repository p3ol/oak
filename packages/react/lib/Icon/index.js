import { forwardRef } from 'react';
import { classNames } from '@junipero/react';

const Icon = forwardRef(({ className, children, ...rest }, ref) =>
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
