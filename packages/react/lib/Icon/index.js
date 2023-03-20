import { classNames } from '@junipero/react';

const Icon = ({ className, children, ...rest }) =>
  typeof children === 'function' ? children() : (
    <i
      className={classNames('icon junipero-icons', className)}
      children={children}
      { ...rest }
    />
  );

Icon.displayName = 'Icon';

export default Icon;
