import type { ComponentPropsWithoutRef } from 'react';
import { classNames } from '@junipero/react';

const Icon = ({ className, ...rest }: ComponentPropsWithoutRef<'i'>) => (
  <i className={classNames('icon junipero-icons', className)} { ...rest } />
);

Icon.displayName = 'Icon';

export default Icon;
