import { ElementObject } from '@oakjs/core';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

declare interface ButtonProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

declare function Button(props: ButtonProps): ReactNode | JSX.Element;

export default Button;
