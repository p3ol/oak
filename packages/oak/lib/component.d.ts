import { TYPE_COL } from "./core/Col/index";
import { TYPE_ROW } from "./core/Row/index";

declare interface Style {
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
}

export declare interface COMPONENT {
  style?: Style;
  responsive?: {
    xl?: "hide" | "show";
    lg?: "hide" | "show";
    md?: "hide" | "show";
    sm?: "hide" | "show";
    xs?: "hide" | "show";
  };
}

export { TYPE_COL, TYPE_ROW };
