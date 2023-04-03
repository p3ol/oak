import { ComponentObject, ElementObject, Element } from '@oakjs/core';
import { ReactNode, MutableRefObject, ComponentPropsWithoutRef } from 'react';

declare interface FoldableProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  element: ElementObject | Element;
}

declare function Foldable(props: FoldableProps): ReactNode | JSX.Element;

export default Foldable;
