import { ComponentPropsWithoutRef, Ref } from "react";
import {
  useOptions,
  useElement,
  useBuilder,
  COMPONENT,
} from "@poool/oak/dist/types";

interface BuilderProps extends ComponentPropsWithoutRef<any> {
  [key: string]: any;
  options?: Options;
  value?: Array<any>;
  containerProps?: Array<any>;
  onChange?: (event: { value: Array<any> }) => void;
  onImageUpload?: (event: any) => void;
  className?: String;
  ref?: Ref<any>;
  content: Array<COMPONENT>;
}
declare function Builder(props: BuilderProps): JSX.Element;
export { Builder, useOptions, useBuilder, useElement };
