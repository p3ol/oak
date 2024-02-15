import { ElementObject } from '@oakjs/core';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

declare interface EmptySpaceProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

declare function EmptySpace(props: EmptySpaceProps): ReactNode | JSX.Element;

export default EmptySpace;
