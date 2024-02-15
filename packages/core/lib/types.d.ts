import { Builder } from './Builder';
import { Logger } from './Logger';

export declare interface GetTextCallback {
  (key: string | GetTextCallback, def?: any): any;
}

export declare type ElementId = string | number;

export declare interface ElementObject {
  id: ElementId;
  type: string;
  [_: string]: any
}

export declare class BuilderOptions {
  debug: boolean;
  historyLimit: number;
  overrideStrategy: 'last' | 'merge';
  generateId: () => string | number;
}

export declare interface BuilderObject {
  constructor(opts?: {
    addons?: Array<AddonObject>,
    content?: Array<ElementObject>,
    options?: BuilderOptions,
  });

  options?: BuilderOptions;
  logger?: Logger;

  subscribe(cb: Function): Function;
  setAddons(addons: Array<AddonObject>): void;
  addAddon(addon: AddonObject): void;
  removeAddon(addon: AddonObject): void;
  getAvailableComponents(): Array<ComponentsGroup>;
  getComponent(type: string): Component;
  getComponentDisplayableSettings(component: Component): Array<any>;
  getAvailableFields(): Array<Field>;
  getField(type: string): Field;
  getOverride(
    type: string,
    target: Component | Field,
    options?: {
      output?: 'field';
      field?: Field;
    },
  ): ComponentOverride | FieldOverride;
  mergeOverrides(overrides: Array<ComponentOverride | FieldOverride>): void;
  getContent(): Array<ElementObject>;
  setContent(content: Array<ElementObject>, options?: { emit: boolean }): void;
  createElement(type: string, opts: {
    component?: Component;
    override?: ComponentOverride;
    baseElement?: object;
    resetIds?: boolean;
  }): object;
  addElement(element: ElementObject, options?: {
    component?: Component;
    parent?: Array<ElementObject>;
    position?: 'before' | 'after';
  }): Element;
  addElements(elements: Array<ElementObject>, options?: {
    parent?: Array<ElementObject>;
    position?: 'before' | 'after';
  }): Array<ElementObject>;
  canUndo(): boolean;
  canRedo(): boolean;
  undo(): void;
  redo(): void;
  resetHistory(): void;
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
  render?: (props: any) => any;
}

export declare class Field {
  static FIND_PREDICATE(type: string): (field: Field) => boolean;

  constructor(props: object);
  type: string;
  props: object;
  render: () => any;
}

export declare interface ComponentOverrideObject {
  id?: string;
  type?: string;
  targets?: Array<string>;
  fields?: Array<any>;
  render?: (props?: any) => any;
  sanitize?: () => any;
  construct?: ({ builder }: {builder?: BuilderObject} = {}) => ComponentObject;
  duplicate?: (elmt?: ComponentObject) => ComponentObject;
}

export declare class ComponentOverride {
  constructor(props: object);
  id: string;
  type: string;
  targets: Array<string>;
  fields: Array<any>;
  render: (props?: any) => any;
  sanitize: () => any;
  construct: ({ builder }: {builder?: BuilderObject} = {}) => ComponentObject;
  duplicate: (elmt?: ComponentObject) => ComponentObject;
}

export declare interface FieldOverrideObject {
  id: string;
  type: string;
  targets: Array<string>;
  props: object;
  render?: () => any;
}

export declare class FieldOverride {
  constructor(props: object);
  id: string;
  type: string;
  targets: Array<string>;
  props: object;
  render: () => any;
}

export declare interface SettingOverrideObject {
  type: string;
  targets: Array<string>;
  key: string | Array<string> | Array<ComponentSettingsFieldKeyTuple>;
  id?: string;
  label?: string | GetTextCallback;
  description?: string | GetTextCallback;
  placeholder?: string | GetTextCallback;
  default?: any;
  displayable?: boolean;
  valueType?: string;
  priority?: number;
  fields?: Array<ComponentSettingsFieldObject>;
  props?: object;
  condition: (element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }) => boolean;
}

export declare class SettingOverride {
  constructor(props: object);
  type: string;
  targets: Array<string>;
  key: string | Array<string> | Array<ComponentSettingsFieldKeyTuple>;
  id: string;
  label: string | GetTextCallback;
  description: string | GetTextCallback;
  placeholder: string;
  default: any;
  displayable: boolean;
  valueType: string;
  priority: number;
  fields: Array<ComponentSettingsField>;
  props: object;
  condition: (element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }) => boolean;
}

export declare interface ComponentSettingsFieldOptionObject {
  value: any;
  title: string | GetTextCallback;
}

export declare interface ComponentSettingsFieldObject<
  T = Array<ComponentSettingsFieldObject>
> {
  priority?: number;
  type: string;
  key: string | Array<string> | Array<ComponentSettingsFieldKeyTuple>;
  tab?: string;
  id?: string;
  label?: string | GetTextCallback;
  description?: string | GetTextCallback;
  placeholder?: string | GetTextCallback;
  default?: any;
  options?: Array<ComponentSettingsFieldOptionObject> | any;
  displayable?: boolean;
  valueType?: string;
  fields?: T;
  props?: object;
  condition?: (element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }) => boolean;
}

export declare class ComponentSettingsField {
  static FIND_PREDICATE(type: string):
    (field: ComponentSettingsField) => boolean;

  constructor(props: object);
  priority: number;
  type: string;
  tab: string;
  id: string;
  key: string | Array<string> | Array<ComponentSettingsFieldKeyTuple>;
  placeholder: string | GetTextCallback;
  default: any;
  label: string | GetTextCallback;
  description: string | GetTextCallback;
  displayable: boolean;
  valueType: string;
  fields: Array<ComponentSettingsField>;
  props: object;
  condition: (element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }) => boolean;
}

export declare interface ComponentSettingsTabObject {
  id: string;
  priority?: number;
  title?: string | GetTextCallback;
  condition?: (element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }) => boolean;
  fields?: Array<ComponentSettingsField | ComponentSettingsFieldObject>;
}

export declare class ComponentSettingsTab {
  static FIND_PREDICATE(id: string): (tab: ComponentSettingsTab) => boolean;

  constructor(props: object);
  type: string;
  id: string;
  priority: number;
  title: string | GetTextCallback;
  condition: (element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }) => boolean;
  fields: Array<ComponentSettingsField>;
}

export declare class ComponentSettingsFormObject {
  title: string | GetTextCallback;
  floatingSettings?: object;
  defaults?: object;
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
  defaults?: object;
  fields?: Array<ComponentSettingsTab | ComponentSettingsField>;
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
  options?: Array<ComponentOption | ComponentOptionObject>;
  settings?: ComponentSettingsForm | ComponentSettingsFormObject;
  disallow?: Array<string>;
  render?: (props?: any) => any;
  sanitize?: () => any;
  construct?: ({ builder }: {builder?: BuilderObject} = {}) => ComponentObject;
  duplicate?: (elmt?: ComponentObject) => ComponentObject;
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
  disallow: Array<string>;
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

export declare interface ComponentTabOject {
  id: string;
  title: string | GetTextCallback;
  components: Array<Component | ComponentObject>;
}
export declare interface AddonObject {
  components?: Array<Component | ComponentObject | ComponentTabOject>;
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
