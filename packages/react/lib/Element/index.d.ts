import { ReactNode, ComponentPropsWithoutRef } from 'react';
import {
  ElementObject,
  Element as CoreElement,
  ComponentObject,
  Component,
} from '@oakjs/core';

export declare interface ElementProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  depth?: number;
  element?: ElementObject | CoreElement;
  parent?: Array<ElementObject | CoreElement>;
  parentComponent?: ComponentObject | Component;
}

declare function Element(props: ElementProps): ReactNode | JSX.Element;

export default Element;
