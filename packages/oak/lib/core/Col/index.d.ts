import { COMPONENT, Style } from "../../component";

declare type Responsive =
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
  | "fluid"
  | "auto"
  | "hide";

export declare type TYPE_COL = {
  type: "col";
  responsive?: {
    xl?: Responsive;
    lg?: Responsive;
    md?: Responsive;
    sm?: Responsive;
    xs?: Responsive;
  };
  content?: Array<COMPONENT>;
  style?: Style;
  [key: string]: any;
};
