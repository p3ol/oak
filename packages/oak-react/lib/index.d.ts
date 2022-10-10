import { ComponentPropsWithoutRef, Ref } from "react";

//TODO
type COMPONENT_TYPES = TYPE_ROW | TYPE_COL | TYPE_TEXT;
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

interface BuilderProps extends ComponentPropsWithoutRef<any> {
  [key: string]: any;
  options?: Options;
  value?: Array<any>;
  containerProps?: Array<any>;
  onChange?: (event: { value: Array<any> }) => void;
  onImageUpload?: (event: any) => void;
  className?: String;
  ref?: Ref<any>;
  content: Array<COMPONENT_TYPES>;
}

declare function useOptions(): Object;
declare function useBuilder(): {
  components: Array<any>;
  content: Array<any>;
  rest: Array<any>;
};
declare function useElement(): {
  element: Object;
  parent: Object;
};
declare function Builder(props: BuilderProps): JSX.Element;
export { Builder, useOptions, useBuilder, useElement };
