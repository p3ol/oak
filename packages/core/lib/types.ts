import type { Component, ComponentOverride } from './classes';
import type Builder from './Builder';

export declare interface GetTextCallback {
  (key: string | GetTextCallback, def?: any): any;
}

export declare type EmitterCallback = (...args: any[]) => void;

export declare type ElementId = string | number;

export declare interface ElementObject {
  id?: ElementId;
  type?: string;
  content?: string | Function | ElementObject[];
  [_: string]: any;
}

export interface ComponentOptionObject {
  icon?: any;
  render?(props?: any): any;
}

export declare interface ComponentSettingsFieldKeyTuple {
  from: string;
  to: string;
  default: any;
}

export declare interface FieldObject {
  type: string;
  props?: object;
  render?(props: any, opts?: any): any; // TODO fix this
  deserialize?(val: string): any;
  onChange?<T = any>(
    field: FieldContent<T>,
    element?: ElementObject
  ): void;
}

export declare interface ComponentOverrideObject {
  id?: string;
  type?: 'component';
  targets?: string[];
  fields?: ComponentSettingsFieldObject[];
  construct?(opts?: { builder?: Builder }): ElementObject;
  deserialize?(opts?: { builder?: Builder }): ElementObject;
  render?(props?: any, opts?: any): any; // TODO fix this
  sanitize?(elmt?: ElementObject, opts?: {
    builder: Builder;
  }): ElementObject;
  duplicate?(elmt?: ElementObject): ElementObject;
  priority?: number;
  editable?: boolean;
}

export declare interface FieldOverrideObject {
  type: 'field';
  construct?: Function; //TODO fix it
  targets?: string[];
  props?: Record<string, any>;
  id?: string;
  render?(): any;
  priority?: number;
  onChange?<T = any>(
    name: string,
    field: FieldContent<T>,
    element?: ElementObject
  ): void;
}

export declare interface SettingOverrideObject {
  type: 'setting';
  targets?: string[];
  key?: string | string[] | ComponentSettingsFieldKeyTuple[];
  id?: string;
  label?: string | GetTextCallback;
  title?: string | GetTextCallback;
  info?: string | GetTextCallback;
  description?: string | GetTextCallback;
  placeholder?: string | GetTextCallback;
  default?: any;
  displayable?: boolean;
  valueType?: string;
  priority?: number;
  options?: Array<any>;
  fields?: (ComponentSettingsFieldObject)[];
  props?: Record<string, any>;
  parseTitle?(value: any): string;
  parseValue?(value: any): any;
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
  };
}

export declare interface ComponentSettingsFieldObject {
  name?: string;
  priority?: number;
  type: string;
  key?: string | string[];
  tab?: string;
  id?: string;
  label?: string | GetTextCallback;
  info?: string | GetTextCallback;
  description?: string | GetTextCallback;
  title?: string | GetTextCallback;
  placeholder?: string | GetTextCallback;
  default?: any;
  options?: ComponentSettingsFieldOptionObject[] | Record<string, any>[];
  displayable?: boolean | ((element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }) => boolean);
  valueType?: string;
  fields?: ComponentSettingsFieldObject[];
  props?: Record<string, any>;
  checkedLabel?: string | GetTextCallback;
  uncheckedLabel?: string | GetTextCallback;
  parseTitle?(value: any): string;
  parseValue?(value: any): any;
  condition?(element: Element | ElementObject, opts?: {
    component: ComponentObject;
    builder: Builder;
  }): boolean;
  disabled?: boolean;
  required?: boolean;
}

export declare interface ComponentSettingsTabObject {
  id: string;
  type?: string;
  priority?: number;
  title?: string | GetTextCallback;
  fields?: (ComponentSettingsFieldObject)[];
  condition?(element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }): boolean;
  renderForm?(props: any): any;
}

export declare class ComponentSettingsFormObject {
  title?: string | GetTextCallback;
  floatingSettings?: Record<string, any> | Function;
  defaults?: any;
  fields?: (
    ComponentSettingsTabObject |
    ComponentSettingsFieldObject
  )[];
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
  options?: ComponentOptionObject[];
  settings?: ComponentSettingsFormObject | ComponentSettingsTabObject;
  disallow?: string[];
  render?(props?: any): any;
  deserialize?: Function;
  serialize?: Function;
  sanitize?(
    element: ElementObject, { builder }: { builder: Builder }
  ): ElementObject
  construct?(opts?: { builder?: Builder }): ElementObject;
  duplicate?(elmt?: ElementObject): ElementObject;
  getContainers?(element: ElementObject): ElementObject[][];
}

export declare interface ComponentsGroupObject {
  type: string;
  id: string;
  name: string | GetTextCallback;
  usable?: boolean;
  components: (ComponentObject)[];
}

export declare interface TextsSheetObject {
  id: string;
  texts: Record<string, any>;
}

export declare interface ComponentTabOject {
  id: string;
  title: string | GetTextCallback;
  components: (Component | ComponentObject)[];
}

export declare interface AddonObject {
  components?: (ComponentObject | ComponentTabOject)[];
  fields?: (FieldObject)[];
  texts?: (TextsSheetObject)[];
  overrides?: (
    ComponentOverrideObject |
    FieldOverrideObject |
    SettingOverrideObject
  )[];
  settings?: (
    ComponentSettingsTabObject |
    ComponentSettingsFieldObject
  )[];
}

export declare interface BuilderObject {
  debug?: boolean;
  generateId?: () => string | number
  historyLimit?: number;
  overrideStrategy?: 'last' | 'merge';
  content?: ElementObject[];
  addons?: AddonObject[];
  onChange?(content: ElementObject[]): void;
  editableType?: 'floating' | 'modal';
}

export declare type ElementSettingsComplexKey = {
  from: string,
  to: string,
  default?: string
}

export declare type ElementSettingsKeyObject =
  | string
  | ElementSettingsComplexKey
  | Array<string | ElementSettingsComplexKey>;

export declare interface StoreSanitizeOptions {
  component?: Component;
  override?: ComponentOverride;
  resetIds?: boolean;
}

export declare interface StoreFindOptions {
  parent?: Array<ElementObject>;
}

export declare type StoreFindDeepOptions = Partial<StoreFindOptions & {
  deep?: boolean;
}>;

export declare type FieldContent<T = any> = {
  valid?: boolean;
  checked?: boolean;
  value?: T;
}

export declare interface EventCallback {
  (eventName: string, ...args: any[]): void;
}
