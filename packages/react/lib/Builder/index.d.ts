import { ReactNode, ComponentPropsWithRef, FormEvent } from 'react';
import { AddonObject, BuilderOptions, ElementObject } from '@oakjs/core';

interface ImageUploadCallbackResult {
  url: string;
  name: string;
  [key: string]: any;
}

declare interface BuilderProps extends ComponentPropsWithRef<any> {
  className?: string;
  defaultValue?: Array<ElementObject>;
  value?: Array<ElementObject>;
  addons: Array<AddonObject>;
  rootBoundary?: string | Element | DocumentFragment;
  onChange?(content: Array<ElementObject>): void;
  onImageUpload?(event: FormEvent): Promise<ImageUploadCallbackResult>;
  children?: ReactNode | JSX.Element;
  activeTextSheet?: string;
  options?: BuilderOptions;
  [key: string]: any;
}

declare function Builder(props: BuilderProps): ReactNode | JSX.Element;

export default Builder;
