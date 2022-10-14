import { COMPONENT, TYPE_COL, TYPE_ROW } from "./component";

interface OverrideField {
  key: string;
  type: string;
}

interface OverrideComponent {
  /**type of object you want to overrides, currently, just component is available */
  type: "component";
  /** Array of component type you want to override*/
  components: Array<string>;
  /** Component's fields you want to override */
  fields: Array<OverrideField>;
  /** construct function overrides, takes the element, and should return new Object */
  construct?: (element: Object) => Object;
  /** duplicate function overrides, takes the element, and should return new Object */
  duplicate?: (element: Object) => Object;
}
declare function useOptions(): Object;
declare function useBuilder(): {
  components: Array<any>;
  content: Array<COMPONENT>;
  [key]: any;
};
declare function useElement(): {
  element: Object;
  parent: Object;
};
interface AddonComponent {
  id: String;
  name: String | Function;
  type: "component";
  render: Function;
  construct: Function;
  icon?: String | Function;
  options?: Object;
  settings?: Object;
  editable?: Boolean;
  duplicate?: Function;
}

interface AddonFieldType {
  type: String;
  render: Function;
  default?: Any;
  serialize?: Function;
  deserialize?: Function;
}
interface TextKey {
  [key: string]: string | TextKey;
}

interface Addon {
  components: Array<AddonComponent>;
  fieldTypes: Array<AddonFieldType>;
}
interface Options {
  /**Whether we display debug output */
  debug?: boolean;
  /**Texts you want to display
   * { key: {subkey: 'value'} }
   */
  texts?: TextKey;
  /**overrides: Allows to override the various fields of one or multiple existing component*/
  overrides?: Array<OverrideComponent>;
  /** addons: Adds a list of addons to add to the page builder. */
  addons: Array<Addon>;
}

export {
  useOptions,
  useBuilder,
  useElement,
  AddonComponent,
  AddonFieldType,
  Addon,
  Options,
  OverrideComponent,
  OverrideField,
  TYPE_COL,
  TYPE_ROW,
  COMPONENT,
};
