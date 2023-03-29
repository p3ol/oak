export declare interface GetTextCallback {
  (key: string | GetTextCallback, def?: any): any;
}

export declare type ElementId = string | number;

export declare interface ElementObject {
  id: ElementId;
}

export declare class BuilderOptions {
  debug: boolean;
  generateId: () => string | number;
}

export declare class ComponentOption {
  constructor(props: object);
  icon: any;
  render: () => any;
}

export declare interface ComponentSettingFieldKeyTuple {
  from: string;
  to: string;
  default: any;
}

export declare interface FieldObject {
  type: string;
  props?: object;
  render?: () => any;
}

export declare class Field {
  static FIND_PREDICATE(type: string): (field: Field) => boolean;

  constructor(props: object);
  type: string;
  props: object;
  render: () => any;
}

export declare interface ComponentOverrideObject {
  type: string;
  targets: Array<string>;
  fields: Array<any>;
  render?: () => any;
  sanitize?: () => any;
  construct?: () => any;
  duplicate?: () => any;
}

export declare class ComponentOverride {
  constructor(props: object);
  type: string;
  targets: Array<string>;
  fields: Array<any>;
  render: () => any;
  sanitize: () => any;
  construct: () => any;
  duplicate: () => any;
}

export declare interface FieldOverrideObject {
  type: string;
  targets: Array<string>;
  props: object;
  render?: () => any;
}

export declare class FieldOverride {
  constructor(props: object);
  type: string;
  targets: Array<string>;
  props: object;
  render: () => any;
}

export declare interface ComponentSettingFieldObject {
  type: string;
  label: string | GetTextCallback;
  key: string | Array<string> | Array<ComponentSettingFieldKeyTuple>;
  placeholder?: string;
  default?: any;
  displayable?: boolean;
  valueType?: string;
  fields?: Array<ComponentSettingFieldObject>;
  props?: object;
  condition?: (element: Element) => boolean;
}

export declare class ComponentSettingField {
  static FIND_PREDICATE(type: string):
    (field: ComponentSettingField) => boolean;

  constructor(props: object);
  type: string;
  key: string | Array<string> | Array<ComponentSettingFieldKeyTuple>;
  placeholder: string;
  default: any;
  label: string;
  displayable: boolean;
  valueType: string;
  fields: Array<ComponentSettingField>;
  props: object;
  condition: (element: Element) => boolean;
}

export declare interface ComponentSettingGroupObject {
  title: string | GetTextCallback;
  fields: Array<ComponentSettingFieldObject>;
}

export declare class ComponentSetting {
  static DEFAULT_SETTINGS: ComponentSettingGroupObject;
  static DEFAULT_STYLES_SETTINGS: ComponentSettingGroupObject;
  static DEFAULT_RESPONSIVE_SETTINGS: ComponentSettingGroupObject;

  constructor(props: object);
  title: string;
  label: string;
  floatingSettings: object;
  fields: Array<ComponentSettingField>;
  condition: () => boolean;
}

export declare interface ComponentObject {
  type: string;
  id?: string;
  group?: string;
  icon?: any;
  name?: string;
  hasCustomInnerContent?: boolean;
  draggable?: boolean;
  droppable?: boolean;
  usable?: boolean;
  editable?: boolean;
  options?: Array<ComponentOption>;
  settings?: ComponentSetting;
  render?: () => any;
  sanitize?: () => any;
  construct?: () => any;
  duplicate?: () => any;
  getContainers?: () => Array<any>;
}

export declare class Component {
  static FIND_PREDICATE(id: string): (component: Component) => boolean;

  constructor(props: object);
  type: string;
  id: string;
  group: string;
  icon: any;
  name: string;
  hasCustomInnerContent: boolean;
  draggable: boolean;
  droppable: boolean;
  usable: boolean;
  editable: boolean;
  options: Array<ComponentOption>;
  settings: ComponentSetting;
  render: () => any;
  sanitize: () => any;
  construct: () => any;
  duplicate: () => any;
  getContainers: () => Array<any>;
}

export declare class ComponentsGroup {
  static FIND_PREDICATE(id: string): (group: ComponentsGroup) => boolean;

  constructor(props: object);
  type: string;
  id: string;
  name: string;
  usable: boolean;
  components: Array<Component>;
}
export declare interface ComponentsGroupObject {
  type: string;
  id: string;
  name: string;
  usable: boolean;
  components: Array<Component | ComponentObject>;
}

export declare interface TextsSheetObject {
  id: string;
  texts: object;
}

export declare class TextsSheet {
  static FIND_PREDICATE(id: string): (sheet: TextsSheet) => boolean;

  constructor(props: object);
  id: string;
  texts: object;
}

export declare interface AddonObject {
  components?: Array<Component | ComponentObject>;
  fields?: Array<Field | FieldObject>;
  texts?: Array<TextsSheet | TextsSheetObject>;
  overrides?: Array<ComponentOverride | FieldOverride>;
}
