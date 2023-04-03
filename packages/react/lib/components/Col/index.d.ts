import { ComponentObject, ElementObject, Element } from '@oakjs/core';
import { ReactNode, MutableRefObject, ComponentPropsWithoutRef } from 'react';

declare interface ColProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  element: ElementObject | Element;
}

declare function Col(props: ColProps): ReactNode | JSX.Element;

export default Col;
