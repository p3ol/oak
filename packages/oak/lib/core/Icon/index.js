import { classNames } from '@junipero/react';

export default ({ className, children, ...rest }) =>
  typeof children === 'function' ? children() : (
    <i
      className={classNames('oak-icons', className)}
      children={children}
      { ...rest }
    />
  );
