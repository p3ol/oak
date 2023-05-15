import { ComponentObject, ElementObject, Element } from '@oakjs/core';
import { ReactNode, MutableRefObject, ComponentPropsWithoutRef } from 'react';

declare interface ButtonProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  element: ElementObject | Element;
}

declare function Button(props: ButtonProps): ReactNode | JSX.Element;

export default Button;
