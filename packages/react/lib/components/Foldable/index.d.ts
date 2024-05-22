import { ReactNode, ComponentPropsWithoutRef } from 'react';
import {
  ComponentObject,
  ElementObject,
  Component,
} from '@oakjs/core';

declare interface FoldableProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
  component?: ComponentObject | Component;
  parentComponent?: ComponentObject | Component;
  parent?: Array<ElementObject>;
  depth?: number;
}

declare function Foldable(props: FoldableProps): ReactNode | JSX.Element;

export default Foldable;
