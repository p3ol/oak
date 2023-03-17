export class Component {
  static FIND_PREDICATE = id => c => c.id === id;

  constructor (props) {
    if (!props.id) {
      throw new Error('Component must have an id');
    }

    this.type = 'component';
    this.id = props.id;
    this.name = props.name || '';
    this.group = props.group;
    this.render = props.render;
    this.sanitize = props.sanitize;
    this.construct = props.construct;
    this.duplicate = props.duplicate;
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
