import type { ComponentPropsWithoutRef } from 'react';

export declare interface DynamicComponentProps
  extends ComponentPropsWithoutRef<any> {
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
