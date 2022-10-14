import { TYPE_COL } from "../Col";
import { COMPONENT_BASE } from "../../component";

export declare type TYPE_ROW = {
  type: "row";
  settings?: {
    flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
    justifyContent?:
      | "flex-start"
      | "center"
      | "flex-end"
      | "space-between"
      | "space-around";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
    gutters?: "Column gap" | "Enabed" | "Disabled";
    [key: string]: any;
  };
  cols: Array<TYPE_COL>;
  [key: string]: any;
} & COMPONENT_BASE;
