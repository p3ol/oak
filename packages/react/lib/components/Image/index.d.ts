import { ElementObject } from '@oakjs/core';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

declare interface ImageProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

declare function Image(props: ImageProps): ReactNode | JSX.Element;

export default Image;
