import { ComponentPropsWithoutRef, MutableRefObject } from 'react';
import { Options, COMPONENT, COMPONENT_BASE } from '@poool/oak';

export declare type BuilderRef = {
  innerRef: MutableRefObject<any>;
  builderRef: MutableRefObject<>;
  setContent: (content: Array<COMPONENT>) => void
}
interface BuilderProps extends ComponentPropsWithoutRef<any> {
  options?: Options;
  value?: Array<COMPONENT>;
  containerProps?: Array<any>;
  onChange?: (event: { value: Array<COMPONENT> }) => any;
  onImageUpload?: (event: any) => { url: string; name?: string };
  className?: String;
  ref?: MutableRefObject<BuilderRef>;
  content?: Array<COMPONENT>;
}
declare function Builder(props: BuilderProps): JSX.Element;
export { Builder };
