import type { ComponentPropsWithoutRef } from 'react';

export declare interface DynamicComponentProps
  extends ComponentPropsWithoutRef<any> {
    render: React.FC<any>;
}

const DynamicComponent = (
  { render: Renderer, ...props }: DynamicComponentProps
) => (
  <Renderer {...props} />
);

export default DynamicComponent;
