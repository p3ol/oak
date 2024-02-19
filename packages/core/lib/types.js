export class BuilderOptions {
  constructor (props) {
    this.debug = props.debug || false;
    this.generateId = props.generateId;
    this.historyLimit = props.historyLimit || 20;
    this.overrideStrategy = props.overrideStrategy || 'last';
  }
}

export class Component {
  static FIND_PREDICATE = id => c => c.id === id;

  constructor (props) {
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
  constructor (props) {
    this.type = 'field';
    this.id = props.id;
    this.targets = props.targets || [];
    this.render = props.render;
    this.props = props.props || {};
  }
}

export class SettingOverride {
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
  constructor (props) {
    this.icon = props.icon;
    this.render = props.render;
  }
}

export class ComponentSettingsForm {
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

  constructor (props) {
    if (!props.id) {
      throw new Error('TextsSheet must have an id');
    }

    this.id = props.id;
    this.texts = props.texts || {};
  }
}
