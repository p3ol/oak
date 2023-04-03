import { ElementObject, Element } from '@oakjs/core';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

export declare interface ContainerProps extends ComponentPropsWithoutRef<any> {
  element?: ElementObject | Element;
  content?: Array<ElementObject | Element>;
  depth?: number;
}

declare function Container(props: ContainerProps): ReactNode | JSX.Element;

export default Container;
