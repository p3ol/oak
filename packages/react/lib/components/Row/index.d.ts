import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type {
  ComponentObject,
  ElementObject,
  Component,
} from '@oakjs/core';

declare interface RowProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
  parent: Array<ElementObject>;
  component?: ComponentObject | Component;
  parentComponent?: ComponentObject | Component;
  depth?: number;
}

declare function Row(props: RowProps): ReactNode | JSX.Element;

export default Row;
