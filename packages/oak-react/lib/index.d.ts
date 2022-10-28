import { ComponentPropsWithoutRef, MutableRefObject } from 'react';
import { Options, Component } from '@poool/oak';

export declare type BuilderRef = {
  innerRef: MutableRefObject<any>;
  builderRef: MutableRefObject<>;
  setContent: (content: Array<Component>) => void
}
interface BuilderProps extends ComponentPropsWithoutRef<any> {
  options?: Options;
  value?: Array<Component>;
  containerProps?: Array<any>;
  onChange?: (event: { value: Array<Component> }) => any;
  onImageUpload?: (event: any) => { url: string; name?: string };
  className?: String;
  ref?: MutableRefObject<BuilderRef>;
  content?: Array<Component>;
}
declare function Builder(props: BuilderProps): JSX.Element;
export { Builder };
