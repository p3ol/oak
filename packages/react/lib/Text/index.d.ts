import { GetTextCallback } from '@oakjs/core';
import { ReactNode, ComponentPropsWithoutRef } from 'react';

export declare interface TextProps extends ComponentPropsWithoutRef<any> {
  children?: ReactNode | JSX.Element | GetTextCallback;
  name?: string;
  default: ReactNode | JSX.Element | GetTextCallback;
}

declare function Text(props: TextProps): ReactNode | JSX.Element;

export default Text;
