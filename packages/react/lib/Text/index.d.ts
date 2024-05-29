import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type { GetTextCallback } from '@oakjs/core';

export declare interface TextProps extends ComponentPropsWithoutRef<any> {
  children?: ReactNode | JSX.Element | GetTextCallback;
  name?: string;
  default: ReactNode | JSX.Element | GetTextCallback;
}

declare function Text(props: TextProps): ReactNode | JSX.Element;

export default Text;
