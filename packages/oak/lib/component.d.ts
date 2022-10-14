import { TYPE_COL } from "./core/Col";
import { TYPE_ROW } from "./core/Row";
import { TYPE_EMPTY_SPACE } from "./core/EmptySpace";

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
  backgroungSize?: "contain" | "cover";
  backgroundPosition?: String;
  backgroundRepeat?: "no-repeat" | "repeat-y" | "repeat-x" | "repeat";
  backgroundColor?: String;
  [key: string]: any;
}

export declare type COMPONENT =
  | COMPONENT_BASE
  | TYPE_EMPTY_SPACE
  | TYPE_COL
  | TYPE_ROW;

export declare interface COMPONENT_BASE {
  type: string;
  style?: Style;
  responsive?: {
    xl?: "hide" | "show";
    lg?: "hide" | "show";
    md?: "hide" | "show";
    sm?: "hide" | "show";
    xs?: "hide" | "show";
    [key: string]: any;
  };
  [key: string]: any;
}

export { TYPE_COL, TYPE_ROW, TYPE_EMPTY_SPACE };
