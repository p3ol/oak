import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type { ElementObject } from '@oakjs/core';

declare interface TextProps extends ComponentPropsWithoutRef<any> {
  element: ElementObject;
}

declare function Text(props: TextProps): ReactNode | JSX.Element;

export default Text;
