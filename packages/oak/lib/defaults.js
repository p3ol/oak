import { classNames } from '@poool/junipero-utils';

export const COMPONENT_DEFAULT = {
  id: 'unknown',
  name: 'Unknown',
  type: 'component',
  render: ({ element, className }) => (
    <pre className={classNames('oak-unknown', className)}>
      { JSON.stringify(element) }
    </pre>
  ),
};
