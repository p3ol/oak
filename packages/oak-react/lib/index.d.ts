import { ComponentPropsWithoutRef, Ref } from "react";
import { Options, COMPONENT } from "@poool/oak";

interface BuilderProps extends ComponentPropsWithoutRef<any> {
  [key: string]: any;
  options?: Options;
  value?: Array<COMPONENT>;
  containerProps?: Array<any>;
  onChange?: (event: { value: Array<COMPONENT> }) => any;
  onImageUpload?: (event: any) => { url: string; name?: string };
  className?: String;
  ref?: Ref<any>;
  content?: Array<COMPONENT>;
}
declare function Builder(props: BuilderProps): JSX.Element;
export { Builder };
