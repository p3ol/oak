import { forwardRef } from 'react';
import { classNames } from '@poool/junipero-utils';

import Icon from '../Icon';

export default forwardRef(({
  className,
  option,
  renderIcon,
  draggable,
  ...props
}, ref) => (
  <a
    { ...props }
    ref={ref}
    href="#"
    draggable={draggable ?? false}
    className={classNames('oak-option', className)}
  >
    { renderIcon ? renderIcon?.() : (
      <Icon name={option?.icon} />
    ) }
  </a>
));
