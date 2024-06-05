export const textField = (...props) => ({
  type: 'text',
  deserialize: val => '' + val,
  render: () => null,
  ...props,
});

export const textareaField = (...props) => ({
  type: 'textarea',
  deserialize: val => '' + val,
  render: () => null,
  ...props,
});

export const selectField = (...props) => ({
  type: 'select',
  render: () => null,
  ...props,
});

export const colorField = (...props) => ({
  type: 'color',
  render: () => null,
  ...props,
});

export const imageField = (...props) => ({
  type: 'image',
  render: () => null,
  ...props,
});

export const dateField = (...props) => ({
  type: 'date',
  render: () => null,
  ...props,
});

export const toggleField = (...props) => ({
  type: 'toggle',
  render: () => null,
  ...props,
});

export const rowComponent = (...props) => ({
  id: 'row',
  name: t => t('core.components.row.name', 'Row'),
  type: 'component',
  render: () => null,
  icon: 'row',
  draggable: false,
  droppable: false,
  hasCustomInnerContent: true,
  editable: true,
  options: [],
  settings: {
    title: t => t('core.components.row.settings.title', 'Row options'),
    floatingSettings: {
      placement: 'right-start',
      shift: { enabled: true },
      autoPlacement: { alignment: 'start' },
    },
    fields: [{
      type: 'select',
      key: 'settings.flexDirection',
      default: 'row',
      label: t =>
        t('core.components.row.settings.flexDirection.title', 'Direction'),
      options: [{
        title: t => t('core.components.row.settings.flexDirection.row',
          'Row (left to right)'),
        value: 'row',
      }, {
        title: t => t('core.components.row.settings.flexDirection.rowReverse',
          'Reversed row (right to left)'),
        value: 'row-reverse',
      }, {
        title: t => t('core.components.row.settings.flexDirection.column',
          'Column (top to bottom)'),
        value: 'column',
      }, {
        title: t => t(
          'core.components.row.settings.flexDirection.columnReverse',
          'Reversed column (bottom to top)',
        ),
        value: 'column-reverse',
      }],
    }, {
      type: 'select',
      key: 'settings.justifyContent',
      default: 'flex-start',
      label: t => t('core.components.row.settings.justifyContent.title',
        'Horizontal alignment'),
      options: [{
        title: t => t('core.components.row.settings.justifyContent.flexStart',
          'Left'),
        value: 'flex-start',
      }, {
        title: t => t('core.components.row.settings.justifyContent.center',
          'Center'),
        value: 'center',
      }, {
        title: t => t('core.components.row.settings.justifyContent.flexEnd',
          'Right'),
        value: 'flex-end',
      }, {
        title: t => t(
          'core.components.row.settings.justifyContent.spaceBetween',
          'Space between columns'
        ),
        value: 'space-between',
      }, {
        title: t => t('core.components.row.settings.justifyContent.spaceAround',
          'Space around columns'),
        value: 'space-around',
      }],
    }, {
      type: 'select',
      key: 'settings.alignItems',
      default: 'flex-start',
      label: t => t('core.components.row.settings.alignItems.title',
        'Vertical alignment'),
      options: [{
        title: t => t('core.components.row.settings.alignItems.flexStart',
          'Top'),
        value: 'flex-start',
      }, {
        title: t => t('core.components.row.settings.alignItems.center',
          'Center'),
        value: 'center',
      }, {
        title: t => t('core.components.row.settings.alignItems.flexEnd',
          'Bottom'),
        value: 'flex-end',
      }, {
        title: t => t('core.components.row.settings.alignItems.stretch',
          'Stretch'),
        value: 'stretch',
      }],
    }, {
      type: 'select',
      key: 'settings.gutters',
      default: true,
      label: t => t('core.components.row.settings.gutters.title',
        'Column gap'),
      options: [{
        title: t => t('core.components.row.settings.gutters.enabled',
          'Enabled'),
        value: true,
      }, {
        title: t => t('core.components.row.settings.gutters.disabled',
          'Disabled'),
        value: false,
      }],
    }],
  },
  getContainers: element => [element.cols],
  sanitize: (element, { builder } = {}) => {
    const colComponent = builder.getComponent('col');

    if (!colComponent) {
      throw new Error('The `col` component is required to use rows.');
    }

    return {
      ...element,
      cols: !element.cols || !element.cols.length
        ? [builder.createElement('col', { component: colComponent })]
        : element.cols,
    };
  },
  construct: ({ builder } = {}) => {
    const colComponent = builder.getComponent('col');

    if (!colComponent) {
      throw new Error('The `col` component is required to use rows.');
    }

    return {
      type: 'row',
      settings: {
        alignItems: 'flex-start',
      },
      cols: [builder.createElement('col', { component: colComponent })],
    };
  },
  ...props,
});

const COL_SIZES = Array.from({ length: 12 }).map((_, i) => ({
  title: t => (i + 1) + ' ' + t('core.components.col.settings.size.value',
    'column(s)'),
  value: i + 1,
})).reverse();

const COL_RESPONSIVE_SETTINGS = [{
  title: t => t('core.responsive.fluid', 'Flexible'),
  value: 'fluid',
}, {
  title: t => t('core.responsive.auto', 'Adapted to content'),
  value: 'auto',
}, ...COL_SIZES, {
  title: t => t('core.responsive.hide', 'Hidden'),
  value: 'hide',
}];

export const colComponent = (...props) => ({
  id: 'col',
  type: 'component',
  draggable: false,
  droppable: false,
  construct: ({ builder } = {}) => ({
    type: 'col',
    content: [],
    id: builder.generateId(),
    style: {},
  }),
  editable: true,
  usable: false,
  settings: {
    title: t => t('core.components.col.settings.title', 'Col options'),
    floatingSettings: {
      placement: 'left-start',
      shift: { enabled: true },
      autoPlacement: { enabled: false },
    },
    fields: [{
      type: 'select',
      key: 'size',
      default: 'fluid',
      label: t => t('core.components.col.settings.size.title', 'Column size'),
      options: [
        {
          title: t => t('core.responsive.fluid', 'Flexible'),
          value: 'fluid',
        },
        {
          title: t => t('core.responsive.auto', 'Adapted to content'),
          value: 'auto',
        },
        ...COL_SIZES,
      ],
    }, {
      tab: 'responsive',
      key: 'responsive.xl',
      type: 'select',
      label: t => t('core.responsive.xl', 'Extra-large screens'),
      default: 'fluid',
      options: COL_RESPONSIVE_SETTINGS,
    }, {
      tab: 'responsive',
      key: 'responsive.lg',
      type: 'select',
      label: t => t('core.responsive.lg', 'Large screens (desktop)'),
      default: 'fluid',
      options: COL_RESPONSIVE_SETTINGS,
    }, {
      tab: 'responsive',
      key: 'responsive.md',
      type: 'select',
      label: t => t('core.responsive.md', 'Medium screens (tablet)'),
      default: 'fluid',
      options: COL_RESPONSIVE_SETTINGS,
    }, {
      tab: 'responsive',
      key: 'responsive.sm',
      type: 'select',
      label: t => t('core.responsive.sm', 'Small screens (phones)'),
      default: 'fluid',
      options: COL_RESPONSIVE_SETTINGS,
    }, {
      tab: 'responsive',
      key: 'responsive.xs',
      type: 'select',
      label: t => t('core.responsive.xs', 'Extra-small screens (old phones)'),
      default: 'fluid',
      options: COL_RESPONSIVE_SETTINGS,
    }],
    defaults: {
      responsive: false,
    },
  },
  ...props,
});

export const emptySpaceComponent = (...props) => ({
  id: 'empty-space',
  name: t => t('core.components.emptySpace.name', 'Blank space'),
  type: 'component',
  render: () => null,
  icon: 'blank_space',
  options: [],
  settings: {
    title: t =>
      t('core.components.emptySpace.settings.title', 'Blank space options'),
    fields: [{
      type: 'text',
      key: 'settings.height',
      default: '32px',
      displayable: true,
      label: t => t('core.components.emptySpace.settings.height', 'Height'),
    }],
  },
  editable: true,
  construct: () => ({
    type: 'empty-space',
    settings: {
      height: '32px',
    },
  }),
  ...props,
});

export const titleComponent = (...props) => ({
  id: 'title',
  name: t => t('core.components.title.name', 'Title'),
  type: 'component',
  icon: 'title',
  editable: true,
  render: () => null,
  options: [],
  settings: {
    title: t => t('core.components.title.settings.title', 'Title options'),
    fields: [{
      type: 'select',
      key: 'headingLevel',
      default: 'h1',
      displayable: true,
      label: t => t('core.components.title.settings.type.title', 'Type'),
      options: Array.from({ length: 6 }).map((_, i) => ({
        title: t => t('core.components.type.value', 'Title') +
          ` ${i + 1} (h${i + 1})`,
        value: `h${i + 1}`,
      })),
    }, {
      type: 'textarea',
      key: 'content',
      default: '',
      label: t => t('core.components.title.settings.content.title', 'Content'),
    }],
  },
  construct: ({ builder } = {}) => ({
    type: 'title',
    content: builder
      .getText('core.components.title.default', 'This is a title'),
    headingLevel: 'h1',
  }),
  ...props,
});

export const textComponent = (...props) => ({
  id: 'text',
  name: t => t('core.components.text.name', 'Text'),
  type: 'component',
  render: () => null,
  icon: 'multiline',
  options: [],
  settings: {
    title: t => t('core.components.text.settings.title', 'Text options'),
    fields: [{
      type: 'textarea',
      key: 'content',
      default: '',
      label: t => t('core.components.text.settings.content.title', 'Content'),
    }],
  },
  editable: true,
  construct: ({ builder } = {}) => ({
    type: 'text',
    content: builder.getText(
      'core.components.text.default',
      'This is some fancy text content'
    ),
  }),
  ...props,
});

export const imageComponent = (...props) => ({
  id: 'image',
  name: t => t('core.components.image.name', 'Image'),
  type: 'component',
  render: () => null,
  icon: 'image',
  editable: true,
  options: [],
  settings: {
    title: t => t('core.components.image.settings.title', 'Image options'),
    fields: [{
      type: 'image',
      key: ['url', 'name'],
      default: '',
      label: t => t('core.components.image.settings.image.title', 'Image'),
    }, {
      type: 'select',
      key: 'settings.size',
      label: t => t(
        'core.components.image.settings.image.size.title',
        'Image size'
      ),
      default: 'auto',
      displayable: true,
      options: [{
        title: t => t(
          'core.components.image.settings.image.size.auto',
          'Adapted to content'
        ),
        value: 'auto',
      }, {
        title: t => t(
          'core.components.image.settings.image.size.full',
          'Real size'
        ),
        value: 'full',
      }, {
        title: t => t(
          'core.components.image.settings.image.size.custom',
          'Custom'
        ),
        value: 'custom',
      }],
    }, {
      type: 'text',
      key: 'settings.width',
      displayable: true,
      condition: element =>
        element?.settings?.size === 'custom',
      label: t => t(
        'core.components.image.settings.image.size.width',
        'Image width'
      ),
      placeholder: t => t(
        'core.components.image.settings.image.size.width',
        'Image width'
      ),
    }, {
      type: 'text',
      key: 'settings.height',
      displayable: true,
      condition: element =>
        element?.settings?.size === 'custom',
      label: t => t(
        'core.components.image.settings.image.size.height',
        'Image height'
      ),
      placeholder: t => t(
        'core.components.image.settings.image.size.height',
        'Image height'
      ),
    }, {
      type: 'select',
      key: 'settings.textAlign',
      displayable: true,
      label: t => t(
        'core.components.image.settings.image.align.title',
        'Image alignment'
      ),
      default: 'left',
      options: [{
        title: t => t(
          'core.components.image.settings.image.align.left',
          'Left'
        ),
        value: 'left',
      }, {
        title: t => t(
          'core.components.image.settings.image.align.center',
          'Center'
        ),
        value: 'center',
      }, {
        title: t => t(
          'core.components.image.settings.image.align.right',
          'Right'
        ),
        value: 'right',
      }],
    }],
  },
  construct: () => ({
    type: 'image',
    url: '',
    name: '',
  }),
  ...props,
});

export const buttonComponent = (...props) => ({
  id: 'button',
  name: t => t('core.components.button.name', 'Button'),
  type: 'component',
  render: () => null,
  icon: 'button',
  options: [],
  settings: {
    title: t => t('core.components.button.settings.title', 'Button options'),
    fields: [{
      type: 'textarea',
      key: 'content',
      default: '',
      label: t => t('core.components.button.settings.content.title', 'Content'),
    }, {
      type: 'select',
      key: 'action',
      default: 'link',
      displayable: true,
      label: t => t('core.components.button.settings.action.title', 'Action'),
      options: [{
        title: t => t(
          'core.components.button.settings.action.openLink',
          'Open a link'
        ),
        value: 'link',
      }, {
        title: t => t(
          'core.components.button.settings.action.fireEvent',
          'Trigger an event'
        ),
        value: 'event',
      }],
    }, {
      type: 'text',
      key: 'url',
      default: '',
      displayable: true,
      label: t => t('core.components.button.settings.url.title', 'URL link'),
      condition: element => element.action === 'link',
    }, {
      type: 'text',
      key: 'event',
      default: '',
      displayable: true,
      label: t => t(
        'core.components.button.settings.event.title',
        'Javascript event name'
      ),
      condition: element => element.action === 'event',
    }, {
      type: 'select',
      key: 'settings.buttonType',
      default: 'button',
      label: t => t(
        'core.components.button.settings.type.title',
        'HTML element type'
      ),
      options: [{
        title: t => t('core.components.button.settings.type.button', 'Button'),
        value: 'button',
      }, {
        title: t => t('core.components.button.settings.type.links', 'Link'),
        value: 'link',
      }],
    }],
  },
  editable: true,
  construct: ({ builder } = {}) => ({
    type: 'button',
    content: builder.getText('core.components.button.default', 'Click me !'),
    action: 'link',
    url: '',
    settings: {
      buttonType: 'button',
    },
  }),
  ...props,
});

export const foldableComponent = (...props) => ({
  id: 'foldable',
  name: t => t('core.components.foldable.name', 'Foldable'),
  type: 'component',
  render: () => null,
  icon: 'foldable',
  editable: true,
  hasCustomInnerContent: true,
  draggable: false,
  droppable: false,
  getContainers: element =>
    [element.content, element.seeMore, element.seeLess],
  settings: {
    title: t => t(
      'core.components.foldable.settings.title', 'Foldable options'),
    floatingSettings: {
      placement: 'right-start',
      autoPlacement: {
        alignment: 'start',
      },
    },
    fields: [{
      type: 'select',
      key: 'settings.seeMorePosition',
      default: 'after',
      displayable: true,
      label: t => t(
        'core.components.foldable.settings.seeMorePosition.title',
        'See more placement'
      ),
      options: [{
        title: t => t(
          'core.components.foldable.settings.seeMorePosition.before',
          'Before'
        ),
        value: 'before',
      }, {
        title: t => t(
          'core.components.foldable.settings.seeMorePosition.after',
          'After'
        ),
        value: 'after',
      }],
    }],
  },
  construct: () => ({
    type: 'foldable',
    settings: {
      seeMorePosition: 'after',
    },
    content: [],
    seeMore: [],
    seeLess: [],
  }),
  ...props,
});

export const stylingSettings = (...props) => ({
  id: 'styling',
  type: 'tab',
  title: t => t('core.styling.title', 'Styling'),
  ...props,
  fields: [...(props?.fields || []), {
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
});

export const responsiveSettings = (...props) => ({
  id: 'responsive',
  type: 'tab',
  title: t => t('core.responsive.title', 'Responsive'),
  ...props,
  fields: [...(props?.fields || []), {
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
    condition: (_, { component } = {}) =>
      component.settings?.defaults?.responsive !== false,
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
    condition: (_, { component } = {}) =>
      component.settings?.defaults?.responsive !== false,
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
    condition: (_, { component } = {}) =>
      component.settings?.defaults?.responsive !== false,
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
    condition: (_, { component } = {}) =>
      component.settings?.defaults?.responsive !== false,
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
    condition: (_, { component } = {}) =>
      component.settings?.defaults?.responsive !== false,
  }],
});

export const baseFields = () => [
  textField(),
  textareaField(),
  selectField(),
  colorField(),
  imageField(),
  dateField(),
  toggleField(),
];

export const baseComponents = () => [
  rowComponent(),
  colComponent(),
  emptySpaceComponent(),
  titleComponent(),
  textComponent(),
  imageComponent(),
  buttonComponent(),
  foldableComponent(),
];

export const baseSettings = () => [
  stylingSettings(),
  responsiveSettings(),
];

export const coreComponentsGroup = (...props) => ({
  id: 'core',
  type: 'group',
  name: t => t('core.components.core.title', 'Core components'),
  components: baseComponents(),
  ...props,
});

export const baseAddon = () => ({
  components: [coreComponentsGroup()],
  fields: baseFields(),
  settings: baseSettings(),
});
