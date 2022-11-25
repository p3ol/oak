import { ComponentPropsWithoutRef, MutableRefObject } from 'react';
import { Options, Element, Field } from '@poool/oak';
import { AddonComponent, Oak, OverrideComponent } from '@poool/oak/lib';

interface innerBuilderRef extends Omit<Oak, 'setRef' | 'setReady' | 'destroy'> {
  addComponent: (
    props: AddonComponent,
    options?: {grouId?: String | number }
  ) => void;
  removeComponent: (
    id: String | number,
    options?: {groupId?: String | number}
  ) => void;
  duplicateElement: (
    elmt: Element,
    options?: {parent?: Array<Element>}
  ) => void;
  moveElement: (
    elmt: Element,
    target: Element,
    options?: {parent?: Array<Element>, position?: 'after' | 'before'}
  ) => void;
  findNearestParent: (
    elmt: Element,
    options?: {parent?: Array<Element>}
  ) => Element;
  contains: () => Boolean;
  getComponent: () => Element;
  getField: () => Field;
  getOverrides: () => OverrideComponent;
}
export declare type BuilderRef = {
  innerRef: MutableRefObject<any>;
  builderRef: MutableRefObject<innerBuilderRef | undefined>;
  setContent: (content: Array<Element>) => void
}

interface BuilderProps extends ComponentPropsWithoutRef<any> {
  options?: Options;
  value?: Array<Element>;
  containerProps?: Array<any>;
  onChange?: (event: { value: Array<Element> }) => any;
  onImageUpload?: (event: any) => { url: string; name?: string };
  className?: String;
  ref?: MutableRefObject<BuilderRef>;
}
declare function Builder(props: BuilderProps): JSX.Element;
export { Builder };
