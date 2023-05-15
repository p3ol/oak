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
  Element as CoreElement,
  ElementObject,
  ComponentSettingsField,
  ComponentSettingsFieldObject,
} from '@oakjs/core';

export declare interface ImageUploadCallbackResult {
  url: string;
  name: string;
  [key: string]: any;
}

export declare interface BuilderContextValue {
  builder: CoreBuilder;
  content: Array<Element | ElementObject>;
  rootBoundary: MutableRefObject<any> | Element | DocumentFragment;
  onImageUpload?(event: FormEvent): Promise<ImageUploadCallbackResult>;
  rootRef: MutableRefObject<any>;
  floatingsRef: MutableRefObject<any>;
}

export declare type BuilderRef = {
  builder: CoreBuilder;
  content: Array<ElementObject>;
  isOak: boolean;
  catalogueRef: MutableRefObject<any>;
  innerRef: MutableRefObject<any>;
};

export declare interface BuilderProps extends ComponentPropsWithRef<any> {
  activeTextSheet?: string;
  addons: Array<AddonObject>;
  bottomHistoryButtonsContainer?: string | Element | DocumentFragment;
  bottomHistoryButtonsEnabled?: boolean;
  children?: ReactNode | JSX.Element;
  className?: string;
  defaultValue?: Array<ElementObject>;
  historyEnabled?: boolean;
  options?: BuilderOptions;
  rootBoundary?: string | Element | DocumentFragment;
  topHistoryButtonsContainer?: string | Element | DocumentFragment;
  topHistoryButtonsEnabled?: boolean;
  value?: Array<ElementObject>;
  [key: string]: any;
  onChange?(content: Array<ElementObject>): void;
  onImageUpload?(event: FormEvent, opts: {
    element?: ElementObject | CoreElement;
    setting?: ComponentSettingsFieldObject | ComponentSettingsField;
  }): Promise<ImageUploadCallbackResult>;
  ref?: MutableRefObject<BuilderRef>;
}

declare function Builder(props: BuilderProps): ReactNode | JSX.Element;

export default Builder;
