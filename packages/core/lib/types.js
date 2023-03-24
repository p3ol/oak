export class BuilderOptions {
  constructor (props) {
    this.debug = props.debug || false;
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
    this.options = (props.options || []).map(o => new ComponentOption(o));
    this.settings = new ComponentSetting(props.settings || {});
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

export class ComponentOption {
  constructor (props) {
    this.icon = props.icon;
    this.render = props.render;
  }
}

export class ComponentSetting {
  static DEFAULT_SETTINGS = {
    title: t => t('core.settings.title', 'Settings'),
    fields: [],
  };

  static DEFAULT_STYLES_SETTINGS = {
    title: t => t('core.styling.title', 'Styling'),
    fields: [{
      label: t => t('core.styling.paddings.title', 'Inside spacing'),
      fields: [{
        type: 'text',
        key: 'styles.paddingTop',
        placeholder: t => t('core.styling.paddings.top', 'Top'),
      }, {
        type: 'text',
        key: 'styles.paddingRight',
        placeholder: t => t('core.styling.paddings.right', 'Right'),
      }, {
        type: 'text',
        key: 'styles.paddingBottom',
        placeholder: t => t('core.styling.paddings.bottom', 'Bottom'),
      }, {
        type: 'text',
        key: 'styles.paddingLeft',
        placeholder: t => t('core.styling.paddings.left', 'Left'),
      }],
    }, {
      label: t => t('core.styling.margins.title', 'Outside spacing'),
      fields: [{
        type: 'text',
        key: 'styles.marginTop',
        placeholder: t => t('core.styling.margins.top', 'Top'),
      }, {
        type: 'text',
        key: 'styles.marginRight',
        placeholder: t => t('core.styling.margins.right', 'Right'),
      }, {
        type: 'text',
        key: 'styles.marginBottom',
        placeholder: t => t('core.styling.margins.bottom', 'Bottom'),
      }, {
        type: 'text',
        key: 'styles.marginLeft',
        placeholder: t => t('core.styling.margins.left', 'Left'),
      }],
    }, {
      label: t => t('core.styling.background.image.title', 'Background image'),
      fields: [{
        key: 'styles.backgroundImage',
        type: 'image',
        props: {
          iconOnly: true,
        },
      }, {
        label: t => t('core.styling.background.size.title', 'Size'),
        key: 'styles.backgroundSize',
        type: 'select',
        default: 'default',
        placeholder: t =>
          t('core.styling.background.size.title', 'Background size'),
        options: [{
          title: t => t('core.styling.background.size.default', 'Default'),
          value: 'default',
        }, {
          title: t => t('core.styling.background.size.cover', 'Fill'),
          value: 'cover',
        }, {
          title: t => t('core.styling.background.size.contain', 'Fit'),
          value: 'contain',
        }],
      }, {
        label: t => t('core.styling.background.position.title', 'Position'),
        key: 'styles.backgroundPosition',
        type: 'select',
        default: 'center',
        placeholder: t =>
          t('core.styling.background.position.title', 'Background position'),
        options: [{
          title: t => t('core.styling.background.position.center', 'Centered'),
          value: 'center',
        }, {
          title: t => t('core.styling.background.position.top', 'Top'),
          value: 'top',
        }, {
          title: t => t('core.styling.background.position.right', 'Right'),
          value: 'right',
        }, {
          title: t => t('core.styling.background.position.bottom', 'Bottom'),
          value: 'bottom',
        }, {
          title: t => t('core.styling.background.position.left', 'Left'),
          value: 'left',
        }, {
          title: t =>
            t('core.styling.background.position.centerTop', 'Center top'),
          value: 'center top',
        }, {
          title: t =>
            t('core.styling.background.position.centerBottom', 'Center bottom'),
          value: 'center bottom',
        }, {
          title: t =>
            t('core.styling.background.position.leftCenter', 'Center left'),
          value: 'left center',
        }, {
          title: t =>
            t('core.styling.background.position.leftTop', 'Top left'),
          value: 'left top',
        }, {
          title: t =>
            t('core.styling.background.position.leftBottom', 'Bottom left'),
          value: 'left bottom',
        }, {
          title: t =>
            t('core.styling.background.position.rightCenter', 'Center right'),
          value: 'right center',
        }, {
          title: t =>
            t('core.styling.background.position.rightTop', 'Top right'),
          value: 'right top',
        }, {
          title: t =>
            t('core.styling.background.position.rightBottom', 'Bottom right'),
          value: 'right bottom',
        }],
      }, {
        label: t => t('core.styling.background.repeat.title', 'Repeat'),
        key: 'styles.backgroundRepeat',
        type: 'select',
        default: 'no-repeat',
        placeholder: t =>
          t('core.styling.background.repeat.title', 'Background repeat'),
        options: [{
          title: t =>
            t('core.styling.background.repeat.noRepeat', 'No repeat'),
          value: 'no-repeat',
        }, {
          title: t =>
            t('core.styling.background.repeat.repeatX', 'Repeat horizontally'),
          value: 'repeat-x',
        }, {
          title: t =>
            t('core.styling.background.repeat.repeatY', 'Repeat vertically'),
          value: 'repeat-y',
        }, {
          title: t => t('core.styling.background.repeat.both',
            'Repeat horizontally & vertically'),
          value: 'repeat',
        },
        ],
      }],
    }, {
      label: t =>
        t('core.styling.background.color.title', 'Background color'),
      placeholder: '#FFF',
      type: 'color',
      key: 'styles.backgroundColor',
    }, {
      label: t =>
        t('core.styling.className.title', 'Additional CSS class'),
      type: 'text',
      placeholder: 'my-button',
      key: 'settings.className',
    }],
  };

  static DEFAULT_RESPONSIVE_SETTINGS = {
    title: t => t('core.responsive.title', 'Responsive'),
    fields: [{
      key: 'responsive.xl',
      type: 'select',
      label: t => t('core.responsive.xl', 'Extra-large screens'),
      default: 'show',
      options: [{
        title: t => t('core.responsive.show', 'Visible'),
        value: 'show',
      }, {
        title: t => t('core.responsive.hide', 'Hidden'),
        value: 'hide',
      }],
    }, {
      key: 'responsive.lg',
      type: 'select',
      label: t => t('core.responsive.lg', 'Large screens (desktop)'),
      default: 'show',
      options: [{
        title: t => t('core.responsive.show', 'Visible'),
        value: 'show',
      }, {
        title: t => t('core.responsive.hide', 'Hidden'),
        value: 'hide',
      }],
    }, {
      key: 'responsive.md',
      type: 'select',
      label: t => t('core.responsive.md', 'Medium screens (tablet)'),
      default: 'show',
      options: [{
        title: t => t('core.responsive.show', 'Visible'),
        value: 'show',
      }, {
        title: t => t('core.responsive.hide', 'Hidden'),
        value: 'hide',
      }],
    }, {
      key: 'responsive.sm',
      type: 'select',
      label: t => t('core.responsive.sm', 'Small screens (phones)'),
      default: 'show',
      options: [{
        title: t => t('core.responsive.show', 'Visible'),
        value: 'show',
      }, {
        title: t => t('core.responsive.hide', 'Hidden'),
        value: 'hide',
      }],
    }, {
      key: 'responsive.xs',
      type: 'select',
      label: t => t('core.responsive.xs', 'Extra-small screens (old phones)'),
      default: 'show',
      options: [{
        title: t => t('core.responsive.show', 'Visible'),
        value: 'show',
      }, {
        title: t => t('core.responsive.hide', 'Hidden'),
        value: 'hide',
      }],
    }],
  };

  constructor (props) {
    this.title = props.title;
    this.label = props.label;
    this.floatingSettings = props.floatingSettings;
    this.condition = props.condition;
    this.fields = (props.fields || []).map(f => new ComponentSettingField(f));
  }
}

export class ComponentSettingField {
  static FIND_PREDICATE = type => f => f.type === type;

  constructor (props) {
    if (!props.type) {
      throw new Error('ComponentSettingField must have a type');
    }

    this.type = props.type;
    this.key = props.key;
    this.placeholder = props.placeholder;
    this.default = props.default;
    this.options = props.options;
    this.label = props.label;
    this.displayable = props.displayable;
    this.valueType = props.valueType;
    this.condition = props.condition;
    this.fields = (props.fields || []).map(f => new ComponentSettingField(f));
    this.props = props.props;
  }
}

export class TextsSheet {
  static FIND_PREDICATE = id => s => s.id === id;

  constructor (props) {
    if (!props.type) {
      throw new Error('TextSheep must have an id');
    }

    this.id = props.id;
    this.texts = props.texts || {};
  }
}
