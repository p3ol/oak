import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type { ElementObject } from '@oakjs/core';

declare interface TitleProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

declare function Title(props: TitleProps): ReactNode | JSX.Element;

export default Title;
