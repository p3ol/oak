import { ComponentObject, ElementObject, Element } from '@oakjs/core';
import { ReactNode, MutableRefObject, ComponentPropsWithoutRef } from 'react';

declare interface RowProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  element: ElementObject | Element;
}

declare function Row(props: RowProps): ReactNode | JSX.Element;

export default Row;
