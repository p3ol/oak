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

export declare interface ComponentOptionObject {
  icon: any;
  render: () => any;
}

export declare class ComponentOption {
  constructor(props: object);
  icon: any;
  render: () => any;
}

export declare interface ComponentSettingsFieldKeyTuple {
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

export declare interface ComponentSettingsFieldObject {
  type: string;
  label: string | GetTextCallback;
  key: string | Array<string> | Array<ComponentSettingsFieldKeyTuple>;
  placeholder?: string;
  default?: any;
  displayable?: boolean;
  valueType?: string;
  fields?: Array<ComponentSettingsFieldObject>;
  props?: object;
  condition?: (element: Element | ElementObject) => boolean;
}

export declare class ComponentSettingsField {
  static FIND_PREDICATE(type: string):
    (field: ComponentSettingsField) => boolean;

  constructor(props: object);
  type: string;
  key: string | Array<string> | Array<ComponentSettingsFieldKeyTuple>;
  placeholder: string;
  default: any;
  label: string | GetTextCallback;
  displayable: boolean;
  valueType: string;
  fields: Array<ComponentSettingsField>;
  props: object;
  condition: (element: Element | ElementObject) => boolean;
}

export declare interface ComponentSettingsTabObject {
  id: string;
  priority?: number;
  title?: string | GetTextCallback;
  condition?: (element: Element | ElementObject) => boolean;
  fields?: Array<ComponentSettingsField | ComponentSettingsFieldObject>;
}

export declare class ComponentSettingsTab {
  static FIND_PREDICATE(id: string): (tab: ComponentSettingsTab) => boolean;

  constructor(props: object);
  type: string;
  id: string;
  priority: number;
  title: string | GetTextCallback;
  condition: (element: Element) => boolean;
  fields: Array<ComponentSettingsField>;
}

export declare class ComponentSettingsFormObject {
  title: string | GetTextCallback;
  floatingSettings?: object;
  fields?: Array<
    ComponentSettingsTab |
    ComponentSettingsTabObject |
    ComponentSettingsField |
    ComponentSettingsFieldObject
  >;
}

export declare class ComponentSettingsForm {
  constructor(props: object);
  title?: string | GetTextCallback;
  floatingSettings?: object;
  fields?: Array<ComponentSettingsTab | ComponentSettingsField>;
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
  options?: Array<ComponentOption | ComponentOptionObject>;
  settings?: ComponentSettingsForm | ComponentSettingsFormObject;
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
  settings: ComponentSettingsForm;
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
  overrides?: Array<
    ComponentOverride |
    ComponentOverrideObject |
    FieldOverride |
    FieldOverrideObject
  >;
  settings?: Array<
    ComponentSettingsTab |
    ComponentSettingsTabObject |
    ComponentSettingsField |
    ComponentSettingsFieldObject
  >;
}
