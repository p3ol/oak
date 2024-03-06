import { Builder } from './Builder';
import { Logger } from './Logger';

export declare interface GetTextCallback {
  (key: string | GetTextCallback, def?: any): any;
}

export declare type ElementId = string | number;

export declare interface ElementObject {
  id?: ElementId;
  type?: string;
  [_: string]: any
}

export declare class BuilderOptions {
  debug?: boolean;
  historyLimit?: number;
  overrideStrategy?: 'last' | 'merge';
  generateId?(): string | number;
}

export declare interface ComponentOptionObject {
  icon: any;
  render?(): any;
}

export declare class ComponentOption {
  constructor(props: object);
  icon: any;
  render?(): any;
}

export declare interface ComponentSettingsFieldKeyTuple {
  from: string;
  to: string;
  default: any;
}

export declare interface FieldObject {
  type: string;
  props?: object;
  render?(props: any): any;
}

export declare class Field {
  static FIND_PREDICATE(type: string): (field: Field) => boolean;

  constructor(props: object);
  type: string;
  props: object;
  render?(): any;
}

export declare interface ComponentOverrideObject {
  id?: string;
  type?: string;
  targets?: string[];
  fields?: ComponentSettingsFieldObject[];
  construct?(opts?: { builder?: Builder }): ElementObject;
  render?(props?: any): any;
  sanitize?(): any;
  duplicate?(elmt?: ElementObject): ElementObject;
}

export declare class ComponentOverride {
  constructor(props: object);
  id: string;
  type: string;
  targets: string[];
  fields: ComponentSettingsField[];
  construct?(opts?: { builder?: Builder }): ElementObject;
  render?(props?: any): any;
  sanitize?(): any;
  duplicate?(elmt?: ElementObject): ElementObject;
}

export declare interface FieldOverrideObject {
  id: string;
  type: string;
  targets: string[];
  props: Record<string, any>;
  render?(): any;
}

export declare class FieldOverride {
  constructor(props: object);
  id: string;
  type: string;
  targets: string[];
  props: Record<string, any>;
  render?(): any;
}

export declare interface SettingOverrideObject {
  type: string;
  targets: string[];
  key: string | string[] | ComponentSettingsFieldKeyTuple[];
  id?: string;
  label?: string | GetTextCallback;
  info?: string | GetTextCallback;
  description?: string | GetTextCallback;
  placeholder?: string | GetTextCallback;
  default?: any;
  displayable?: boolean;
  valueType?: string;
  priority?: number;
  fields?: (ComponentSettingsField | ComponentSettingsFieldObject)[];
  props?: Record<string, any>;
  condition?(element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }): boolean;
}

export declare class SettingOverride {
  constructor(props: Record<string, any>);
  type: string;
  targets: string[];
  key: string | string[] | ComponentSettingsFieldKeyTuple[];
  id: string;
  label: string | GetTextCallback;
  info: string | GetTextCallback;
  description: string | GetTextCallback;
  placeholder: string;
  default: any;
  displayable: boolean;
  valueType: string;
  priority: number;
  fields: (ComponentSettingsField | ComponentSettingsFieldObject)[];
  props: Record<string, any>;
  condition?(element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }): boolean;
}

export declare interface ComponentSettingsFieldOptionObject {
  value?: any;
  title?: string | GetTextCallback;
  imageTransformation?: {
    width: number;
    height: number;
    [_: string]: any;
  };
}

export declare interface ComponentSettingsFieldObject {
  priority?: number;
  type: string;
  key: string | string[] | ComponentSettingsFieldKeyTuple[];
  tab?: string;
  id?: string;
  label?: string | GetTextCallback;
  info?: string | GetTextCallback;
  description?: string | GetTextCallback;
  placeholder?: string | GetTextCallback;
  default?: any;
  options?: ComponentSettingsFieldOptionObject |
  ComponentSettingsFieldOptionObject[] |
  Record<string, any>[];
  displayable?: boolean;
  valueType?: string;
  fields?: ComponentSettingsFieldObject[];
  props?: Record<string, any>;
  condition?(element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }): boolean;
}

export declare class ComponentSettingsField {
  static FIND_PREDICATE(type: string):
    (field: ComponentSettingsField) => boolean;

  constructor(props: Record<string, any>);
  priority: number;
  type: string;
  tab: string;
  id: string;
  key: string | string[] | ComponentSettingsFieldKeyTuple[];
  placeholder: string | GetTextCallback;
  default: any;
  label: string | GetTextCallback;
  info: string | GetTextCallback;
  description: string | GetTextCallback;
  displayable: boolean;
  valueType: string;
  fields: ComponentSettingsField[];
  options: ComponentSettingsFieldOptionObject | ComponentSettingsFieldOptionObject[];
  props: Record<string, any>;
  condition?(element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }): boolean;
}

export declare interface ComponentSettingsTabObject {
  id: string;
  priority?: number;
  title?: string | GetTextCallback;
  fields?: (ComponentSettingsField | ComponentSettingsFieldObject)[];
  condition?(element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }): boolean;
  options?: ComponentSettingsFieldOptionObject | ComponentSettingsFieldOptionObject[];
}

export declare class ComponentSettingsTab {
  static FIND_PREDICATE(id: string): (tab: ComponentSettingsTab) => boolean;

  constructor(props: Record<string, any>);
  type: string;
  id: string;
  priority: number;
  title: string | GetTextCallback;
  fields: ComponentSettingsField[];
  condition?(element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }): boolean;
}

export declare class ComponentSettingsFormObject {
  title: string | GetTextCallback;
  floatingSettings?: Record<string, any>;
  defaults?: any;
  fields?: (
    ComponentSettingsTab |
    ComponentSettingsTabObject |
    ComponentSettingsField |
    ComponentSettingsFieldObject
  )[];
}

export declare class ComponentSettingsForm {
  constructor(props: Record<string, any>);
  title?: string | GetTextCallback;
  floatingSettings?: Record<string, any>;
  defaults?: any;
  fields?: (ComponentSettingsTab | ComponentSettingsField)[];
}

export declare interface ComponentObject {
  type?: string;
  id?: string;
  group?: string;
  icon?: any;
  name?: string | GetTextCallback;
  hasCustomInnerContent?: boolean;
  draggable?: boolean;
  droppable?: boolean;
  usable?: boolean;
  editable?: boolean;
  options?: (ComponentOption | ComponentOptionObject)[];
  settings?: ComponentSettingsForm |
    ComponentSettingsFormObject |
    (ComponentSettingsForm | ComponentSettingsFormObject)[];
  disallow?: string[];
  render?(props?: any): any;
  sanitize?(): any;
  construct?(opts?: { builder?: Builder }): ElementObject;
  duplicate?(elmt?: ElementObject): ElementObject;
  getContainers?(element: ElementObject): ElementObject[];
}

export declare class Component {
  static FIND_PREDICATE(id: string): (component: Component) => boolean;

  constructor(props: Record<string, any>);
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
  options: ComponentOption[];
  settings: ComponentSettingsForm;
  disallow: Array<string>;
  render(): any;
  sanitize(): any;
  construct(): ElementObject;
  duplicate(): ElementObject;
  getContainers(element: ElementObject): ElementObject[];
}

export declare class ComponentsGroup {
  static FIND_PREDICATE(id: string): (group: ComponentsGroup) => boolean;

  constructor(props: Record<string, any>);
  type: string;
  id: string;
  name: string;
  usable: boolean;
  components: Component[];
}
export declare interface ComponentsGroupObject {
  type: string;
  id: string;
  name: string;
  usable: boolean;
  components: (Component | ComponentObject)[];
}

export declare interface TextsSheetObject {
  id: string;
  texts: Record<string, any>;
}

export declare class TextsSheet {
  static FIND_PREDICATE(id: string): (sheet: TextsSheet) => boolean;

  constructor(props: Record<string, any>);
  id: string;
  texts: Record<string, any>;
}

export declare interface ComponentTabOject {
  id: string;
  title: string | GetTextCallback;
  components: (Component | ComponentObject)[];
}
export declare interface AddonObject {
  components?: (Component | ComponentObject | ComponentTabOject)[];
  fields?: (Field | FieldObject)[];
  texts?: (TextsSheet | TextsSheetObject)[];
  overrides?: (
    ComponentOverride |
    ComponentOverrideObject |
    FieldOverride |
    FieldOverrideObject
  )[];
  settings?: (
    ComponentSettingsTab |
    ComponentSettingsTabObject |
    ComponentSettingsField |
    ComponentSettingsFieldObject
  )[];
}
