import { ReactNode, ComponentPropsWithoutRef } from 'react';

export declare interface ImageFieldValue {
  url: string;
  name: string;
  [key: string]: any;
}

declare interface ImageFieldProps extends ComponentPropsWithoutRef<any> {
  value?: ImageFieldValue;
  iconOnly?: boolean;
  accept?: ('image/jpeg' | 'image/jpg' | 'image/png' | 'image/svg+xml')[];
  onChange?(field: { value: ImageFieldValue, valid: boolean }): void;
}

declare function ImageField(props: ImageFieldProps): ReactNode | JSX.Element;

export default ImageField;
