import {
  ReactNode,
  ComponentPropsWithRef,
  FormEvent,
  MutableRefObject,
} from 'react';
import {
  AddonObject,
  Builder as CoreBuilder,
  BuilderOptions,
  ElementObject,
} from '@oakjs/core';

interface ImageUploadCallbackResult {
  url: string;
  name: string;
  [key: string]: any;
}

export declare type BuilderRef = {
  builder: CoreBuilder;
  content: Array<ElementObject>;
  isOak: boolean;
  catalogueRef: MutableRefObject<any>;
  innerRef: MutableRefObject<any>;
};

declare interface BuilderProps extends ComponentPropsWithRef<any> {
  className?: string;
  defaultValue?: Array<ElementObject>;
  value?: Array<ElementObject>;
  addons: Array<AddonObject>;
  rootBoundary?: string | Element | DocumentFragment;
  children?: ReactNode | JSX.Element;
  activeTextSheet?: string;
  options?: BuilderOptions;
  [key: string]: any;
  onChange?(content: Array<ElementObject>): void;
  onImageUpload?(event: FormEvent): Promise<ImageUploadCallbackResult>;
  ref?: MutableRefObject<BuilderRef>;
}

declare function Builder(props: BuilderProps): ReactNode | JSX.Element;

export default Builder;
