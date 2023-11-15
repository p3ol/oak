import { MutableRefObject, ComponentPropsWithRef, ReactNode } from 'react';
import {
  Builder,
  Component,
  ComponentObject,
  Element,
  ElementObject,
} from '@oakjs/core';

export declare type OptionRef = {
  isOak: boolean;
  innerRef: MutableRefObject<any>;
  tooltipRef: MutableRefObject<any>;
};

export declare interface OptionObject {
  icon?: ReactNode | JSX.Element;
  render?(props: {
    option: OptionObject;
    className: string;
    element: ElementObject | Element;
    elementInnerRef: MutableRefObject<any>;
    editableRef: MutableRefObject<any>;
    parent: Array<ElementObject | Element>;
    component: ComponentObject | Component;
    builder: Builder;
    index: number;
  }): ReactNode | JSX.Element;
}

export declare interface OptionProps extends ComponentPropsWithRef<any> {
  className?: string;
  iconClassName?: string;
  option: OptionObject,
  draggable?: boolean;
  name?: ReactNode | JSX.Element;
  renderIcon(): ReactNode | JSX.Element;
  ref?: MutableRefObject<OptionRef>;
}

declare function Option(props: OptionProps): ReactNode | JSX.Element;

export default Option;
