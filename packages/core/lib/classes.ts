import type Builder from './Builder';
import type {
  BuilderObject,
  ElementObject,
  ComponentObject,
  ComponentOptionObject,
  ComponentsGroupObject,
  FieldObject,
  ComponentOverrideObject,
  FieldOverrideObject,
  SettingOverrideObject,
  ComponentSettingsFieldObject,
  ComponentSettingsFormObject,
  ComponentSettingsTabObject,
  ComponentSettingsFieldKeyTuple,
  GetTextCallback,
  ComponentSettingsFieldOptionObject,
} from './types';

export class BuilderOptions {
  debug: boolean;
  generateId: () => string | number;
  historyLimit: number;
  overrideStrategy: 'last' | 'merge';
  defaults: Record<string, any>;

  constructor (props?: BuilderObject) {
    this.debug = props?.debug ?? false;
    this.generateId = props?.generateId;
    this.historyLimit = props?.historyLimit ?? 20;
    this.overrideStrategy = props?.overrideStrategy || 'last';
    this.defaults = props?.defaults || {};
  }
}

export class Component {
  static FIND_PREDICATE = (id: string) => (c: Component) => c.id === id;

  type: 'component';
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
  name: string | GetTextCallback;
  hasCustomInnerContent: boolean;
  draggable: boolean;
  droppable: boolean;
  usable: boolean;
  editable: boolean;
  duplicable: boolean;
  copyable: boolean;
  removable: boolean;
  containerEditable: boolean;
  disallow: any;
  options?: ComponentOption[];
  settings?: ComponentSettingsForm;
  deserialize: (
    element?: ElementObject,
    opts?: { builder: Builder }
  ) => ElementObject;
  serialize: (
    element: Partial<ElementObject>,
    opts?: { builder: Builder }
  ) => ElementObject;

  constructor (props: ComponentObject) {
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
    this.duplicable = props.duplicable ?? true;
    this.copyable = props.copyable ?? true;
    this.removable = props.removable ?? true;
    this.containerEditable = props.containerEditable ?? true;
    this.disallow = props.disallow || [];
    this.serialize = props.serialize;
    this.options = (props.options || []).map((
      o: ComponentOptionObject
    ) => new ComponentOption(o));
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
      duplicable: this.duplicable,
      copyable: this.copyable,
      removable: this.removable,
      containerEditable: this.containerEditable,
      options: this.options?.map(o => o.toObject?.() ?? o),
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

  toObject (): ComponentsGroupObject {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      usable: this.usable,
      components: this.components.map(c => c.toObject()),
    };
  }
}

export class Field {
  static FIND_PREDICATE = (type: string) => (f: Field) => f.type === type;

  type: string;
  render: FieldObject['render'];
  props: object;

  constructor (props: FieldObject) {
    if (!props.type) {
      throw new Error('Field must have a type');
    }

    this.type = props.type;
    this.render = props.render;
    this.props = props.props || {};
  }

  toObject (): FieldObject {
    return {
      type: this.type,
      render: this.render,
      props: this.props,
    };
  }
}

export class Override {
  type: 'component' | 'field' | 'setting';
}

export class ComponentOverride extends Override {
  id: string;
  targets: string[];
  fields?: ComponentSettingsFieldObject[];
  render: ComponentOverrideObject['render'];
  construct: (
    opts: { builder: Builder, baseElement?: ElementObject }
  ) => ElementObject;
  sanitize: ComponentOverrideObject['sanitize'];
  duplicate: ComponentOverrideObject['duplicate'];
  deserialize: ComponentOverrideObject['deserialize'];
  priority: number;
  serialize: (
    element: Partial<ElementObject>,
    opts?: { builder: Builder }
  ) => ElementObject;
  getContainers: (element: ElementObject) => ElementObject[][];
  editable?: boolean;
  usable?: boolean;
  duplicable?: boolean;
  copyable?: boolean;
  draggable?: boolean;
  droppable?: boolean;
  removable?: boolean;
  containerEditable?: boolean;
  disallow: string[];

  constructor (props: ComponentOverrideObject | ComponentOverride) {
    super();

    this.type = 'component';
    this.id = props.id;
    this.targets = props.targets || [];
    this.fields = props.fields;
    this.render = props.render;
    this.sanitize = props.sanitize;
    this.construct = props.construct;
    this.duplicate = props.duplicate;
    this.deserialize = props.deserialize;
    this.priority = props.priority;
    this.editable = props.editable;
    this.usable = props.usable;
    this.duplicable = props.duplicable;
    this.copyable = props.copyable;
    this.draggable = props.draggable;
    this.droppable = props.droppable;
    this.removable = props.removable;
    this.containerEditable = props.containerEditable;
    this.disallow = props.disallow || [];
  }

  toObject (): ComponentOverrideObject {
    return {
      type: 'component',
      id: this.id,
      targets: this.targets,
      fields: this.fields,
      render: this.render,
      sanitize: this.sanitize,
      construct: this.construct,
      duplicate: this.duplicate,
      deserialize: this.deserialize,
      priority: this.priority,
      editable: this.editable,
      usable: this.usable,
      duplicable: this.duplicable,
      copyable: this.copyable,
      draggable: this.draggable,
      droppable: this.droppable,
      removable: this.removable,
      containerEditable: this.containerEditable,
      disallow: this.disallow,
    };
  }
}

export class FieldOverride extends Override {
  id: string;
  targets: string[];
  render: FieldOverrideObject['render'];
  props: object;
  construct: (opts?: {
    builder?: Builder;
    element?: ElementObject;
  }) => ElementObject;
  priority: number;
  onChange: FieldOverrideObject['onChange'];

  constructor (props: FieldOverrideObject) {
    super();

    this.type = 'field';
    this.id = props.id;
    this.targets = props.targets || [];
    this.render = props.render;
    this.priority = props.priority;
    this.props = props.props || {};
    this.construct = props.construct;
    this.onChange = props.onChange;
  }

  toObject (): FieldOverrideObject {
    return {
      type: 'field',
      id: this.id,
      targets: this.targets,
      render: this.render,
      priority: this.priority,
      props: this.props,
      construct: this.construct,
      onChange: this.onChange,
    };
  }
}

export class SettingOverride extends Override {
  key: string | string[] | ComponentSettingsFieldKeyTuple[];
  targets: string[];
  id: string;
  placeholder: string | GetTextCallback;
  default: any;
  options: ComponentSettingsFieldOptionObject[];
  label: string | GetTextCallback;
  description: string | GetTextCallback;
  displayable: boolean;
  fieldType: string;
  valueType: string;
  condition: SettingOverrideObject['condition'];
  serialize: SettingOverrideObject['serialize'];
  deserialize: SettingOverrideObject['deserialize'];
  priority: number;
  fields?: ComponentSettingsFieldObject[];
  props: object;
  info: string | GetTextCallback;

  constructor (props: SettingOverrideObject) {
    super();

    this.key = props.key;
    this.type = 'setting';
    this.targets = props.targets || [];
    this.id = props.id;
    this.placeholder = props.placeholder;
    this.default = props.default;
    this.options = props.options;
    this.label = props.label;
    this.description = props.description;
    this.displayable = props.displayable;
    this.fieldType = props.fieldType;
    this.valueType = props.valueType;
    this.condition = props.condition;
    this.serialize = props.serialize;
    this.deserialize = props.deserialize;
    this.priority = props.priority;
    this.info = props.info;
    this.fields = props.fields;
    this.props = props.props;
  }

  toObject (): SettingOverrideObject {
    return {
      type: 'setting',
      key: this.key,
      targets: this.targets,
      id: this.id,
      placeholder: this.placeholder,
      default: this.default,
      options: this.options,
      label: this.label,
      description: this.description,
      displayable: this.displayable,
      fieldType: this.fieldType,
      valueType: this.valueType,
      condition: this.condition,
      serialize: this.serialize,
      deserialize: this.deserialize,
      priority: this.priority,
      info: this.info,
      fields: this.fields,
      props: this.props,
    };
  }
}

export class ComponentOption {
  icon: any;
  render: any;

  constructor (props: ComponentOptionObject) {
    this.icon = props.icon;
    this.render = props.render;
  }

  toObject (): ComponentOptionObject {
    return {
      icon: this.icon,
      render: this.render,
    };
  }
}

export class ComponentSettingsForm {
  title: string | GetTextCallback;
  floatingSettings: any;
  defaults: object;
  fields: (ComponentSettingsField | ComponentSettingsTab)[];

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
  static FIND_PREDICATE = (id: string) =>
    (t: ComponentSettingsTab) => t.id === id;

  type: string;
  id: string;
  title: string | GetTextCallback;
  tab: string;
  priority: number;
  condition: (element: Element | ElementObject, opts?: {
    component: Component | ComponentObject;
    builder: Builder;
  }) => boolean;
  fields: any[];
  displayable: boolean | ((...rest: any) => false);

  constructor (props: ComponentSettingsTabObject) {
    if (!props.id) {
      throw new Error('ComponentSettingsTab must have an id');
    }

    this.type = 'tab';
    this.id = props.id;
    this.tab = props.tab;
    this.priority = props.priority;
    this.title = props.title;
    this.condition = props.condition;
    this.fields = (props.fields || []).map(f =>
      f instanceof ComponentSettingsField ? f : new ComponentSettingsField(f));
  }

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
}

export class ComponentSettingsField {
  static FIND_PREDICATE = (id: string) =>
    (f: ComponentSettingsField) => f.id === id || f.key === id;

  type: string;
  tab: string;
  key: string | string[];
  id: string;
  placeholder: string | GetTextCallback;
  default: any;
  options: any[];
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
  fields: any[];
  props: object;
  display: (value: any) => any;

  constructor (props: ComponentSettingsFieldObject, isOverride?: boolean) {
    if (!props.fields && !props.type && !isOverride) {
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
    this.priority = props.priority;
    this.display = props.display || (v => v);
    this.fields = (props.fields || []).map((
      f: ComponentSettingsFieldObject
    ) => new ComponentSettingsField(f, isOverride));
    this.props = props.props;
  }

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
}

export class TextsSheet {
  static FIND_PREDICATE = (id: string) => (s: { id: string }) => s.id === id;

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
