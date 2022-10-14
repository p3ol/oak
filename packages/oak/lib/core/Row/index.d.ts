import { TYPE_COL } from "../Col";
import { COMPONENT } from "../../component";

export declare interface TYPE_ROW extends COMPONENT {
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
  };
  cols: Array<TYPE_COL>;
}
