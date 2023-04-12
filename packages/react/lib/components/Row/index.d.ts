import { ReactNode, MutableRefObject, ComponentPropsWithoutRef } from 'react';
import {
  ComponentObject,
  ElementObject,
  Element,
  Component,
} from '@oakjs/core';

declare interface RowProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  element: ElementObject | Element;
  parent: Array<ElementObject>;
  component?: ComponentObject | Component;
  parentComponent?: ComponentObject | Component;
  depth?: number;
}

declare function Row(props: RowProps): ReactNode | JSX.Element;

export default Row;
