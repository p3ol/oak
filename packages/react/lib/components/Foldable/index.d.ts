import { ReactNode, MutableRefObject, ComponentPropsWithoutRef } from 'react';
import {
  ComponentObject,
  ElementObject,
  Element,
  Component,
} from '@oakjs/core';

declare interface FoldableProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  element: ElementObject | Element;
  component?: ComponentObject | Component;
  parentComponent?: ComponentObject | Component;
  parent?: Array<ElementObject>;
  depth?: number;
}

declare function Foldable(props: FoldableProps): ReactNode | JSX.Element;

export default Foldable;
