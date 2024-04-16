import Builder from './Builder';

export class BuilderOptions {
  debug: boolean;
  generateId: () => string | number;
  historyLimit: number;
  overrideStrategy: 'last' | 'merge';

  constructor (props) {
    this.debug = props.debug || false;
    this.generateId = props.generateId;
    this.historyLimit = props.historyLimit || 20;
    this.overrideStrategy = props.overrideStrategy || 'last';
  }
}

export class Component {
  static FIND_PREDICATE = id => c => c.id === id;
  type: string;
  id: string;
  group: string;
  render: () => any;
  sanitize: any;
  construct: Function;
  duplicate: Function;
  icon: any;
  getContainers: Function;
  name: string;
  hasCustomInnerContent: boolean;
  draggable: boolean;
  droppable: boolean;
  usable: boolean;
  editable: boolean;
  disallow: any;
  options: any;
  settings: any;

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
    this.options = (props.options || []).map(o => new ComponentOption(o));
    this.settings = new ComponentSettingsForm(props.settings || {});
  }
}

export class ComponentsGroup {
  static FIND_PREDICATE = id => g => g.id === id;
  type: string;
  id: string;
  name: string;
  usable: boolean;
  components: Component[];
  constructor (props) {
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
  render: Function;
  props: object;
  static FIND_PREDICATE = type => f => f.type === type;

  constructor (props) {
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
  sanitize?: Function;
  construct: Function;
  duplicate: Function;

  constructor (props) {
    this.type = 'component';
    this.id = props.id;
    this.targets = props.targets || [];
    this.fields = props.fields || [];
    this.render = props.render;
    this.sanitize = props.sanitize;
    this.construct = props.construct;
    this.duplicate = props.duplicate;
  }
}

export class FieldOverride {
  type: string;
  id: string;
  targets: Array<any>;
  render: Function;
  props: object;

  constructor (props) {
    this.type = 'field';
    this.id = props.id;
    this.targets = props.targets || [];
    this.render = props.render;
    this.props = props.props || {};
  }
}

export class SettingOverride {
  type: string;
  key: string;
  targets: Array<any>;
  id: string;
  placeholder: string;
  default: any;
  options: Array<any>;
  label: string;
  description: string;
  displayable: boolean;
  valueType: string;
  condition: Function;
  priority: number;
  fields: Array<any>;
  props: object;

  constructor (props) {
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
    this.fields = (props.fields || []).map(f => new ComponentSettingsField(f));
    this.props = props.props;
  }
}

export class ComponentOption {
  icon: any;
  render: Function;

  constructor (props) {
    this.icon = props.icon;
    this.render = props.render;
  }
}

export class ComponentSettingsForm {
  title: string;
  floatingSettings: any;
  defaults: object;
  fields: Array<any>;

  constructor (props) {
    this.title = props.title;
    this.floatingSettings = props.floatingSettings;
    this.defaults = props.defaults || {};
    this.fields = (props.fields || []).map(t =>
      t.type === 'tab'
        ? t instanceof ComponentSettingsTab ? t : new ComponentSettingsTab(t)
        : t instanceof ComponentSettingsField
          ? t : new ComponentSettingsField(t)
    );
  }
}

export class ComponentSettingsTab {
  static FIND_PREDICATE = id => t => t.id === id;
  type: string;
  id: string;
  title: string;
  priority: number;
  condition: Function;
  fields: Array<any>;

  constructor (props) {
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
  static FIND_PREDICATE = id => f => f.id === id || f.key === id;
  type: string;
  tab: string;
  key: string;
  id: string;
  placeholder: string;
  default: any;
  options: Array<any>;
  label: string;
  info: string;
  description: string;
  displayable: boolean;
  valueType: string;
  condition: Function;
  priority: number;
  fields: Array<any>;
  props: object;

  constructor (props) {
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
  static FIND_PREDICATE = id => s => s.id === id;
  id: string;
  texts: object;
  constructor (props) {
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
  type: string;
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
  type?: string;
  targets?: string[];
  fields?: ComponentSettingsFieldObject[];
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
  fields?: (ComponentSettingsField | ComponentSettingsFieldObject)[];
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
  displayable?: boolean;
  valueType?: string;
  fields?: ComponentSettingsFieldObject[];
  props?: Record<string, any>;
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
}

export declare class ComponentSettingsFormObject {
  title?: string | GetTextCallback;
  floatingSettings?: Record<string, any>;
  defaults?: any;
  fields?: (
    ComponentSettingsTab |
    ComponentSettingsTabObject |
    ComponentSettingsField |
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
  options?: (ComponentOption | ComponentOptionObject)[];
  settings?: ComponentSettingsForm | ComponentSettingsFormObject;
  disallow?: string[];
  render?(props?: any): any;
  sanitize?(): any;
  construct?(opts?: { builder?: Builder }): ElementObject;
  duplicate?(elmt?: ElementObject): ElementObject;
  getContainers?(element: ElementObject): ElementObject[];
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
