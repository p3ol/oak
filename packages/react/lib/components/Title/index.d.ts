import { ElementObject } from '@oakjs/core';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

declare interface TitleProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

declare function Title(props: TitleProps): ReactNode | JSX.Element;

export default Title;
