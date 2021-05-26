import { classNames } from '@poool/junipero-utils';

export default ({ className, ...rest }) => (
  <i className={classNames('oak-icons', className)} { ...rest } />
);
