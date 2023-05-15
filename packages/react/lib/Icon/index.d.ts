import { ElementObject, Element as CoreElement } from '@oakjs/core';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

export declare interface IconProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
  [key: string]: any;
}

declare function Icon(props: IconProps): ReactNode | JSX.Element;

export default Icon;
