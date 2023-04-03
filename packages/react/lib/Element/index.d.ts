import { ElementObject, Element as CoreElement } from '@oakjs/core';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

export declare interface ElementProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  depth?: number;
  element?: ElementObject | CoreElement;
  parent?: Array<ElementObject | CoreElement>;
}

declare function Element(props: ElementProps): ReactNode | JSX.Element;

export default Element;
