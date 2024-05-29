import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type { ElementObject } from '@oakjs/core';

declare interface ButtonProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

declare function Button(props: ButtonProps): ReactNode | JSX.Element;

export default Button;
