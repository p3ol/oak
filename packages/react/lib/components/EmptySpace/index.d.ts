import { ComponentObject, ElementObject, Element } from '@oakjs/core';
import { ReactNode, MutableRefObject, ComponentPropsWithoutRef } from 'react';

declare interface EmptySpaceProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  element: ElementObject | Element;
}

declare function EmptySpace(props: EmptySpaceProps): ReactNode | JSX.Element;

export default EmptySpace;
