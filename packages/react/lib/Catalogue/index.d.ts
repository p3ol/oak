import { ComponentObject, ElementObject } from '@oakjs/core';
import { ReactNode, MutableRefObject, ComponentPropsWithRef } from 'react';

export declare type CatalogueRef = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  opened: boolean;
  isOak: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface CatalogueProps extends ComponentPropsWithRef<any> {
  className?: string;
  placement?: string;
  onToggle?(props: { opened: boolean }): void;
  onAppend?(props: { component: ComponentObject }): void;
  onPaste?(clipboardData: ElementObject): void;
  ref?: MutableRefObject<CatalogueRef>;
}

declare function Catalogue(props: CatalogueProps): ReactNode | JSX.Element;

export default Catalogue;
