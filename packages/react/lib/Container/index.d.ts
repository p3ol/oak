import { ReactNode, ComponentPropsWithoutRef } from 'react';
import {
  ElementObject,
  ComponentObject,
  Component,
} from '@oakjs/core';

export declare interface ContainerProps extends ComponentPropsWithoutRef<any> {
  element?: ElementObject;
  content?: Array<ElementObject>;
  component?: ComponentObject | Component;
  depth?: number;
}

declare function Container(props: ContainerProps): ReactNode | JSX.Element;

export default Container;
