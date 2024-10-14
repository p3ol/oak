import type { ComponentPropsWithoutRef } from 'react';

import type { CommonFieldProps } from '../types';

export declare interface DynamicComponentProps
  extends ComponentPropsWithoutRef<any>, CommonFieldProps {
    renderer: React.FC<any>;
}

const DynamicComponent = ({
  renderer: Renderer,
  ...props
}: DynamicComponentProps) => {
  if (!Renderer) {
    return null;
  }

  return <Renderer { ...props } />;
};

export default DynamicComponent;
