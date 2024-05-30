import Builder from './Builder';

export class BuilderOptions {
  debug: boolean;
  generateId: () => string | number;
  historyLimit: number;
  overrideStrategy: 'last' | 'merge';
  constructor (props: BuilderObject) {
    this.debug = props.debug || false;
    this.generateId = props.generateId;
    this.historyLimit = props.historyLimit || 20;
    this.overrideStrategy = props.overrideStrategy || 'last';
  }
}

export class Component {
  static FIND_PREDICATE = (id: string) => (c: Component) => c.id === id;
  type: string;
  id: string;
  group: string;
  render: () => any;
  sanitize: (
    element: ElementObject, { builder }: { builder: Builder }
  ) => ElementObject;
  construct: (opts?: { builder?: Builder }) => ElementObject;
  duplicate: (elmt?: ElementObject) => ElementObject;
  icon: any;
  getContainers: (element: ElementObject) => ElementObject[][];
  name: string;
  hasCustomInnerContent: boolean;
  draggable: boolean;
  droppable: boolean;
  usable: boolean;
  editable: boolean;
  disallow: any;
  options: any;
  settings: any;
  deserialize: (opts: { builder: Builder }) => ElementObject;
  serialize: Function; //TODO
  constructor (props: any) {
    if (!props.id) {
      throw new Error('Component must have an id');
    }

    this.type = 'component';
    this.id = props.id;
    this.group = props.group;
    this.render = props.render;
    this.sanitize = props.sanitize;
    this.construct = props.construct;
    this.duplicate = props.duplicate;
    this.icon = props.icon;
    this.getContainers = props.getContainers;
    this.name = props.name || '';
    this.hasCustomInnerContent = props.hasCustomInnerContent ?? false;
    this.draggable = props.draggable ?? true;
    this.droppable = props.droppable ?? true;
    this.usable = props.usable ?? true;
    this.editable = props.editable ?? true;
    this.disallow = props.disallow || [];
    this.serialize = props.serialize;
    this.options = (props.options || []).map(
      (o: ComponentOptionObject) => new ComponentOption(o)
    );
    this.settings = new ComponentSettingsForm(props.settings || {});
    this.deserialize = props.deserialize;
    this.serialize = props.serialize;
  }
  toObject (): ComponentObject {
    return {
      id: this.id,
      type: this.type,
      group: this.group,
      name: this.name,
      icon: this.icon,
      settings: this.settings,
      hasCustomInnerContent: this.hasCustomInnerContent,
      draggable: this.draggable,
      droppable: this.droppable,
      usable: this.usable,
      editable: this.editable,
      options: this.options,
      disallow: this.disallow,
      render: this.render,
      sanitize: this.sanitize,
      construct: this.construct,
      duplicate: this.duplicate,
      getContainers: this.getContainers,
    };
  }
}

export class ComponentsGroup {
  static FIND_PREDICATE = (id: string) => (g: ComponentsGroup) => g.id === id;
  type: string;
  id: string;
  name: string | GetTextCallback;
  usable: boolean;
  components: Component[];
  toObject (): ComponentsGroupObject {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      usable: this.usable,
      components: this.components.map(c => c.toObject()),
    };
  }
  constructor (props: ComponentsGroupObject) {
    if (!props.id) {
      throw new Error('Component Group must have an id');
    }

    this.type = 'group';
    this.id = props.id;
    this.name = props.name;
    this.usable = props.usable ?? true;
    this.components = (props.components || []).map(c =>
      c instanceof Component ? c : new Component(c)
    );
  }
}

export class Field {
  type: string;
  render: (props: any) => any;
  props: object;
  static FIND_PREDICATE = (type: string) => (f: Field) => f.type === type;
  toObject (): FieldObject {
    return {
      type: this.type,
      render: this.render,
      props: this.props,
    };
  }
  constructor (props: FieldObject) {
    if (!props.type) {
      throw new Error('Field must have a type');
    }

    this.type = props.type;
    this.render = props.render;
    this.props = props.props || {};
  }
}

export class ComponentOverride {
  type: string;
  id: string;
  targets: Array<any>;
  fields: Array<any>;
  render: Function;
  construct: (
    opts: { builder: Builder, baseElement?: ElementObject }
  ) => ElementObject;
  sanitize: (
    element: ElementObject, { builder }: { builder: Builder}
  ) => ElementObject;
  duplicate: Function;//TODO fix it
  deserialize: Function;//TODO fix it
  priority: number;
  serialize: Function;//TODO fix it
  getContainers: (element: ElementObject) => ElementObject[][];
  constructor (props: ComponentOverrideObject) {
    this.type = 'component';
    this.id = props.id;
    this.targets = props.targets || [];
    this.fields = props.fields || [];
    this.render = props.render;
    this.sanitize = props.sanitize;
    this.construct = props.construct;
    this.duplicate = props.duplicate;
    this.deserialize = props.deserialize;
    this.priority = props.priority || 0;
  }
}

export class FieldOverride {
  type: string;
  id: string;
  targets: Array<any>;
  render: Function;
  props: object;
  construct: Function;
  priority: number;
  constructor (props : FieldOverrideObject) {
    this.type = 'field';
    this.id = props.id;
    this.targets = props.targets || [];
    this.render = props.render;
    this.priority = props.priority || 0;
    this.props = props.props || {};
    this.construct = props.construct;
  }
}

export class SettingOverride {
  type: string;
  key: string | string[] | ComponentSettingsFieldKeyTuple[];
  targets: Array<any>;//TODO type it
  id: string;
  placeholder: string | GetTextCallback;
  default: any;
  options: Array<any>;//TODO type it
  label: string | GetTextCallback;
  description: string | GetTextCallback;
  displayable: boolean;
  valueType: string;
  condition: Function;
  priority: number;
  fields: Array<any>;
  props: object;
  constructor (props: SettingOverrideObject) {
    this.type = 'setting';
    this.key = props.key;
    this.targets = props.targets || [];
    this.id = props.id;
    this.placeholder = props.placeholder;
    this.default = props.default;
    this.options = props.options;
    this.label = props.label;
    this.description = props.description;
    this.displayable = props.displayable;
    this.valueType = props.valueType;
    this.condition = props.condition;
    this.priority = props.priority || 0;
    this.fields = (props.fields || []).map(
      (f: ComponentSettingsFieldObject) => new ComponentSettingsField(f)
    );
    this.props = props.props;
  }
}

export class ComponentOption {
  icon: any;
  render: Function;

  constructor (props: ComponentOptionObject) {
    this.icon = props.icon;
    this.render = props.render;
  }
}

export class ComponentSettingsForm {
  title: string | GetTextCallback;
  floatingSettings: any;
  defaults: object;
  fields: Array<ComponentSettingsField | ComponentSettingsTab>;

  constructor (props: ComponentSettingsFormObject) {
    this.title = props.title;
    this.floatingSettings = props.floatingSettings;
    this.defaults = props.defaults || {};
    this.fields = (props.fields || []).map(
      (t: ComponentSettingsFieldObject | ComponentSettingsTabObject) =>
        t.type === 'tab'
          ? t instanceof ComponentSettingsTab
            ? t : new ComponentSettingsTab(t as ComponentSettingsTabObject)
          : t instanceof ComponentSettingsField
            ? t : new ComponentSettingsField(t as ComponentSettingsFieldObject)
    );
  }
}

export class ComponentSettingsTab {
  static FIND_PREDICATE = (id: string) => (
    t: ComponentSettingsTab
  ) => t.id === id;
  type: string;
  id: string;
  title: string | GetTextCallback;
  priority: number;
  condition: (element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }) => boolean;
  fields: Array<any>;
  displayable: boolean | ((...rest: any) => false);
  toObject (): ComponentSettingsTabObject {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      priority: this.priority,
      condition: this.condition,
      fields: this.fields.map(f => f.toObject()),
    };
  }
  constructor (props: ComponentSettingsTabObject) {
    if (!props.id) {
      throw new Error('ComponentSettingsTab must have an id');
    }

    this.type = 'tab';
    this.id = props.id;
    this.priority = props.priority || 0;
    this.title = props.title;
    this.condition = props.condition;
    this.fields = (props.fields || []).map(f =>
      f instanceof ComponentSettingsField ? f : new ComponentSettingsField(f));
  }
}

export class ComponentSettingsField {
  static FIND_PREDICATE = (id: string) => (
    f: ComponentSettingsField
  ) => f.id === id || f.key === id;
  type: string;
  tab: string;
  key: string | string[];
  id: string;
  placeholder: string | GetTextCallback;
  default: any;
  options: Array<any>;
  label: string | GetTextCallback;
  info: string | GetTextCallback;
  description: string | GetTextCallback;
  displayable: boolean | ((element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }) => boolean);
  valueType: string;
  condition: (element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }) => boolean;
  priority: number;
  fields: Array<any>;
  props: object;
  toObject (): ComponentSettingsFieldObject {
    return {
      type: this.type,
      tab: this.tab,
      key: this.key,
      id: this.id,
      placeholder: this.placeholder,
      default: this.default,
      options: this.options,
      label: this.label,
      info: this.info,
      description: this.description,
      displayable: this.displayable,
      valueType: this.valueType,
      condition: this.condition,
      priority: this.priority,
      fields: this.fields.map(f => f.toObject()),
      props: this.props,
    };
  }
  constructor (props: ComponentSettingsFieldObject) {
    if (!props.fields && !props.type) {
      throw new Error('ComponentSettingsField must have a type (or be ' +
        'a group of fields)');
    }

    this.type = props.type;
    this.tab = props.tab;
    this.key = props.key;
    this.id = props.id;
    this.placeholder = props.placeholder;
    this.default = props.default;
    this.options = props.options;
    this.label = props.label;
    this.info = props.info;
    this.description = props.description;
    this.displayable = props.displayable;
    this.valueType = props.valueType;
    this.condition = props.condition;
    this.priority = props.priority || 0;
    this.fields = (props.fields || []).map(f => new ComponentSettingsField(f));
    this.props = props.props;
  }
}

export class TextsSheet {
  static FIND_PREDICATE = (id: string) => (s: {id: string}) => s.id === id;
  id: string;
  texts: object;
  constructor (props: {id: string, texts: object}) {
    if (!props.id) {
      throw new Error('TextsSheet must have an id');
    }

    this.id = props.id;
    this.texts = props.texts || {};
  }
}

export declare interface GetTextCallback {
  (key: string | GetTextCallback, def?: any): any;
}

export declare type ElementId = string | number;

export declare interface ElementObject {
  id?: ElementId;
  type?: string;
  content?: Function | ElementObject[] //TODO not sure
  [_: string]: any
}

export declare interface ComponentOptionObject {
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

export declare interface ComponentOverrideObject {
  id?: string;
  type?: 'component';
  targets?: string[];
  fields?: ComponentSettingsFieldObject[];
  construct?(opts?: { builder?: Builder }): ElementObject;
  deserialize?(opts?: { builder?: Builder }): ElementObject;
  render?(props?: any): any;
  sanitize?(): any;
  duplicate?(elmt?: ElementObject): ElementObject;
  priority?: number;
}

export declare interface FieldOverrideObject {
  id: string;
  type: 'field';
  targets: string[];
  props: Record<string, any>;
  render?(): any;
  priority?: number;
  construct: Function;//TODO fix it
}

export declare interface SettingOverrideObject {
  type: string;
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
  condition?(element: Element | ElementObject, opts?: {
    component: ComponentObject;
    builder: Builder;
  }): boolean;
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
}

export declare class ComponentSettingsFormObject {
  title?: string | GetTextCallback;
  floatingSettings?: Record<string, any>;
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
  options?: (ComponentOptionObject)[];
  settings?: ComponentSettingsFormObject;
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
    FieldOverrideObject
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
}
export declare type ElementSettingsComplexKey = {
  from: string,
  to: string,
  default: string
}
export declare type ElementSettingsKeyObject =
  string |
  Array<string |
  ElementSettingsComplexKey> |
  ElementSettingsComplexKey
