import { ReactNode, ComponentPropsWithoutRef } from 'react';
import {
  ElementObject,
  ComponentObject,
  Component,
} from '@oakjs/core';

export declare interface ElementProps extends ComponentPropsWithoutRef<any> {
  depth?: number;
  element?: ElementObject;
  parent?: Array<ElementObject>;
  parentComponent?: ComponentObject | Component;
}

declare function Element(props: ElementProps): ReactNode | JSX.Element;

export default Element;
