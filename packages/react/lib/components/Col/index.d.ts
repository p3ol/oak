import { ElementObject } from '@oakjs/core';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

declare interface ColProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

declare function Col(props: ColProps): ReactNode | JSX.Element;

export default Col;
