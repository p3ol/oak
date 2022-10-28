
import {
  ButtonComponent,
  ImageComponent,
  TextComponent,
  TitleComponent,
} from '@poool/oak-addon-basic-components';

import { ColComponent } from './core/Col';
import { RowComponent } from './core/Row';
import { EmptySpaceComponent } from './core/EmptySpace';

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
declare interface BaseComponent {
  type: String;
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
export declare type Component =
  | BaseComponent
  | EmptySpaceComponent
  | ColComponent
  | RowComponent
  | TextComponent
  | ButtonComponent
  | TitleComponent
  | ImageComponent

export { ColComponent, RowComponent, EmptySpaceComponent, BaseComponent };
