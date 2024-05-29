import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type { ElementObject } from '@oakjs/core';

declare interface ImageProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

declare function Image(props: ImageProps): ReactNode | JSX.Element;

export default Image;
