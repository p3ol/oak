
import {
  ButtonElement,
  ImageElement,
  TextElement,
  TitleElement,
} from '@poool/oak-addon-basic-components';

import { ColElement } from './core/Col';
import { RowElement } from './core/Row';
import { EmptySpaceElement } from './core/EmptySpace';

export declare interface Style {
  paddingTop?: String | Number;
  paddingBottom?: String | Number;
  paddingRight?: String | Number;
  paddingLeft?: String | Number;
  marginTop?: String | Number;
  marginBottom?: String | Number;
  marginRight?: String | Number;
  marginLeft?: String | Number;
  backgroundImage?: String | null;
  backgroungSize?: 'contain' | 'cover';
  backgroundPosition?: String;
  backgroundRepeat?: 'no-repeat' | 'repeat-y' | 'repeat-x' | 'repeat';
  backgroundColor?: String;
  [key: string]: any;
}

export declare interface ResponsiveDisplay {
  xl?: 'show' | 'hide';
  lg?: 'show' | 'hide';
  md?: 'show' | 'hide';
  sm?: 'show' | 'hide';
  xs?: 'show' | 'hide';
  [key: string]: any;
}
declare interface BaseElement {
  type: String;
  id: String | number;
  style?: Style;
  responsive?: {
    xl?: any;
    lg?: any;
    md?: any;
    sm?: any;
    xs?: any;
    [key: string]: any;
  };
  settings?: {
    [key: string]: any;
  }
  [key: string]: any;
}
export declare type Element =
  | BaseElement
  | EmptySpaceElement
  | RowElement
  | TextElement
  | ButtonElement
  | TitleElement
  | ImageElement

export { ColElement, RowElement, EmptySpaceElement, BaseElement };
