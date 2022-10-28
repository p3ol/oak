import { Element, BaseElement } from '../../component';

declare type responsiveGrow =
  | 12
  | 11
  | 10
  | 9
  | 8
  | 7
  | 6
  | 5
  | 4
  | 3
  | 2
  | 1
  | 'fluid'
  | 'auto'
  | 'hide';

export declare interface ColElement extends BaseElement {
  type: 'col';
  responsive?: {
    xl?: responsiveGrow;
    lg?: responsiveGrow;
    md?: responsiveGrow;
    sm?: responsiveGrow;
    xs?: responsiveGrow;
    [key: string]: any;
  };
  content?: Array<Element>;
  [key: string]: any;
}
