import { ElementObject } from '@oakjs/core';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

declare interface TextProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

declare function Text(props: TextProps): ReactNode | JSX.Element;

export default Text;
