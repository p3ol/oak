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
    this.hasCustomInnerContent = props.hasCustomInnerContent || false;
    this.isDraggable = props.isDraggable || false;
    this.isDroppable = props.isDroppable || false;
    this.editable = props.editable || false;
    this.options = props.options || [];
    this.settings = props.settings || [];
  }
}

export class ComponentGroup {
  static FIND_PREDICATE = id => g => g.id === id;

  constructor (props) {
    if (!props.id) {
      throw new Error('Component Group must have an id');
    }

    this.type = 'group';
    this.id = props.id;
    this.name = props.name;
    this.components = props.components || [];
  }
}

export class Field {
  static FIND_PREDICATE = type => f => f.type === type;

  constructor (props) {
    if (!props.id) {
      throw new Error('Field must have a type');
    }

    this.type = props.type;
  }
}

export class ComponentOverride {
  constructor (props) {
    this.type = 'component';
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
    this.targets = props.targets || [];
    this.render = props.render;
  }
}
