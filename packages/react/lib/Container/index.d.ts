import { ReactNode, ComponentPropsWithoutRef } from 'react';
import {
  ElementObject,
  Element,
  ComponentObject,
  Component,
} from '@oakjs/core';

export declare interface ContainerProps extends ComponentPropsWithoutRef<any> {
  element?: ElementObject | Element;
  content?: Array<ElementObject | Element>;
  component?: ComponentObject | Component;
  depth?: number;
}

declare function Container(props: ContainerProps): ReactNode | JSX.Element;

export default Container;
