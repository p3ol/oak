import { get } from '@junipero/core';

import type {
  AddonObject,
  ComponentObject,
  ComponentSettingsFieldObject,
  ComponentSettingsFieldOptionObject,
  ComponentSettingsFormObject,
  ComponentsGroupObject,
  ElementObject,
  FieldObject,
  GetTextCallback,
} from './types';
import Builder from './Builder';

export const textField = (props?: FieldObject): FieldObject => ({
  type: 'text',
  deserialize: (val: string) => '' + val,
  render: () => null,
  ...props,
});

export const textareaField = (props?: FieldObject): FieldObject => ({
  type: 'textarea',
  deserialize: (val: string) => '' + val,
  render: () => null,
  ...props,
});

export const selectField = (props?: FieldObject): FieldObject => ({
  type: 'select',
  render: () => null,
  ...props,
});

export const tagsField = (props?: FieldObject): FieldObject => ({
  type: 'tags',
  render: () => null,
  ...props,
});

export const colorField = (props?: FieldObject): FieldObject => ({
  type: 'color',
  render: () => null,
  ...props,
});

export const imageField = (props?: FieldObject): FieldObject => ({
  type: 'image',
  render: () => null,
  ...props,
});

export const dateField = (props?: FieldObject): FieldObject => ({
  type: 'date',
  render: () => null,
  ...props,
});

export const toggleField = (props?: FieldObject): FieldObject => ({
  type: 'toggle',
  render: () => null,
  ...props,
});

export const rowComponent = (props?: ComponentObject): ComponentObject => ({
  id: 'row',
  name: (t: GetTextCallback) => t('core.components.row.name', 'Row'),
  type: 'component',
  render: () => null,
  icon: 'row',
  draggable: false,
  droppable: false,
  hasCustomInnerContent: true,
  editable: true,
  options: [],
  settings: {
    title: (
      t: GetTextCallback
    ) => t('core.components.row.settings.title', 'Row options'),
    floatingSettings: {
      placement: 'right-start',
      shift: { enabled: true },
      autoPlacement: { alignment: 'start' },
    },
    fields: [{
      type: 'select',
      key: 'settings.flexDirection',
      default: 'row',
      label: (t: GetTextCallback) =>
        t('core.components.row.settings.flexDirection.title', 'Direction'),
      options: [{
        title: (
          t: GetTextCallback
        ) => t('core.components.row.settings.flexDirection.row',
          'Row (left to right)'),
        value: 'row',
      }, {
        title: (
          t: GetTextCallback
        ) => t('core.components.row.settings.flexDirection.rowReverse',
          'Reversed row (right to left)'),
        value: 'row-reverse',
      }, {
        title: (
          t: GetTextCallback
        ) => t('core.components.row.settings.flexDirection.column',
          'Column (top to bottom)'),
        value: 'column',
      }, {
        title: (t: GetTextCallback) => t(
          'core.components.row.settings.flexDirection.columnReverse',
          'Reversed column (bottom to top)',
        ),
        value: 'column-reverse',
      }],
    }, {
      type: 'select',
      key: 'settings.justifyContent',
      default: 'flex-start',
      label: (
        t: GetTextCallback
      ) => t('core.components.row.settings.justifyContent.title',
        'Horizontal alignment'),
      options: [{
        title: (
          t: GetTextCallback
        ) => t('core.components.row.settings.justifyContent.flexStart',
          'Left'),
        value: 'flex-start',
      }, {
        title: (
          t: GetTextCallback
        ) => t('core.components.row.settings.justifyContent.center',
          'Center'),
        value: 'center',
      }, {
        title: (
          t: GetTextCallback
        ) => t('core.components.row.settings.justifyContent.flexEnd',
          'Right'),
        value: 'flex-end',
      }, {
        title: (
          t: GetTextCallback
        ) => t(
          'core.components.row.settings.justifyContent.spaceBetween',
          'Space between columns'
        ),
        value: 'space-between',
      }, {
        title: (
          t: GetTextCallback
        ) => t('core.components.row.settings.justifyContent.spaceAround',
          'Space around columns'),
        value: 'space-around',
      }],
    }, {
      type: 'select',
      key: 'settings.alignItems',
      default: 'flex-start',
      label: (
        t: GetTextCallback
      ) => t('core.components.row.settings.alignItems.title',
        'Vertical alignment'),
      options: [{
        title: (
          t: GetTextCallback
        ) => t('core.components.row.settings.alignItems.flexStart',
          'Top'),
        value: 'flex-start',
      }, {
        title: (
          t: GetTextCallback
        ) => t('core.components.row.settings.alignItems.center',
          'Center'),
        value: 'center',
      }, {
        title: (
          t: GetTextCallback
        ) => t('core.components.row.settings.alignItems.flexEnd',
          'Bottom'),
        value: 'flex-end',
      }, {
        title: (
          t: GetTextCallback
        ) => t('core.components.row.settings.alignItems.stretch',
          'Stretch'),
        value: 'stretch',
      }],
    }, {
      type: 'text',
      key: 'settings.gap',
      label: (t: GetTextCallback) =>
        t('core.components.row.settings.gutters.title', 'Column gap'),
      placeholder: (t: GetTextCallback) =>
        t('core.components.row.settings.gutters.placeholder', '10px'),
    }],
  },
  getContainers: element => [element.cols],
  sanitize: (
    element: ElementObject, { builder }: { builder?: Builder } = {}
  ) => {
    const colComponent = builder.getComponent('col');

    if (!colComponent) {
      throw new Error('The `col` component is required to use rows.');
    }

    return {
      ...element,
      cols: !element.cols?.length
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
  title: (t: GetTextCallback) =>
    (i + 1) + ' ' + t(
      'core.components.col.settings.size.value',
      'column(s)'
    ),
  value: i + 1,
})).reverse();

const COL_RESPONSIVE_SETTINGS: {
  title: string | GetTextCallback;
  value: string | number
}[] = [{
  title: (t: GetTextCallback) => t('core.responsive.fluid', 'Flexible'),
  value: 'fluid',
}, {
  title: (
    t: GetTextCallback
  ) => t('core.responsive.auto', 'Adapted to content'),
  value: 'auto',
}, ...COL_SIZES, {
  title: (t: GetTextCallback) => t('core.responsive.hide', 'Hidden'),
  value: 'hide',
}];

export const colComponent = (props?: ComponentObject): ComponentObject => ({
  id: 'col',
  type: 'component',
  draggable: false,
  construct: ({ builder } = {}) => ({
    type: 'col',
    content: [],
    id: builder.generateId(),
    style: {},
  }),
  editable: true,
  usable: false,
  settings: {
    title: (
      t: GetTextCallback
    ) => t('core.components.col.settings.title', 'Col options'),
    floatingSettings: {
      placement: 'left-start',
      shift: { enabled: true },
      autoPlacement: { enabled: false },
    },
    fields: [{
      type: 'select',
      key: 'size',
      default: 'fluid',
      label: (
        t: GetTextCallback
      ) => t('core.components.col.settings.size.title', 'Column size'),
      options: [
        {
          title: (t: GetTextCallback) => t('core.responsive.fluid', 'Flexible'),
          value: 'fluid',
        },
        {
          title: (
            t: GetTextCallback
          ) => t('core.responsive.auto', 'Adapted to content'),
          value: 'auto',
        },
        ...COL_SIZES,
      ],
    }, {
      tab: 'responsive',
      key: 'responsive.xl',
      type: 'select',
      label: (
        t: GetTextCallback
      ) => t('core.responsive.xl', 'Extra-large screens'),
      default: 'fluid',
      options: COL_RESPONSIVE_SETTINGS,
    }, {
      tab: 'responsive',
      key: 'responsive.lg',
      type: 'select',
      label: (
        t: GetTextCallback
      ) => t('core.responsive.lg', 'Large screens (desktop)'),
      default: 'fluid',
      options: COL_RESPONSIVE_SETTINGS,
    }, {
      tab: 'responsive',
      key: 'responsive.md',
      type: 'select',
      label: (
        t: GetTextCallback
      ) => t('core.responsive.md', 'Medium screens (tablet)'),
      default: 'fluid',
      options: COL_RESPONSIVE_SETTINGS,
    }, {
      tab: 'responsive',
      key: 'responsive.sm',
      type: 'select',
      label: (
        t: GetTextCallback
      ) => t('core.responsive.sm', 'Small screens (phones)'),
      default: 'fluid',
      options: COL_RESPONSIVE_SETTINGS,
    }, {
      tab: 'responsive',
      key: 'responsive.xs',
      type: 'select',
      label: (
        t: GetTextCallback
      ) => t('core.responsive.xs', 'Extra-small screens (old phones)'),
      default: 'fluid',
      options: COL_RESPONSIVE_SETTINGS,
    }],
    defaults: {
      responsive: false,
    },
  },
  ...props,
});

export const emptySpaceComponent = (
  props?: ComponentObject
): ComponentObject => ({
  id: 'empty-space',
  name: (
    t: GetTextCallback
  ) => t('core.components.emptySpace.name', 'Blank space'),
  type: 'component',
  render: () => null,
  icon: 'blank_space',
  options: [],
  settings: {
    title: (t: GetTextCallback) =>
      t('core.components.emptySpace.settings.title', 'Blank space options'),
    fields: [{
      type: 'text',
      key: 'settings.height',
      default: '32px',
      displayable: true,
      label: (
        t: GetTextCallback
      ) => t('core.components.emptySpace.settings.height', 'Height'),
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

export const titleComponent = (props?: ComponentObject): ComponentObject => ({
  id: 'title',
  name: (t: GetTextCallback) => t('core.components.title.name', 'Title'),
  type: 'component',
  icon: 'title',
  editable: true,
  render: () => null,
  options: [],
  settings: {
    title: (
      t: GetTextCallback
    ) => t('core.components.title.settings.title', 'Title options'),
    fields: [{
      type: 'select',
      key: 'headingLevel',
      default: 'h1',
      displayable: true,
      label: (
        t: GetTextCallback
      ) => t('core.components.title.settings.type.title', 'Type'),
      options: Array.from({ length: 6 }).map((_, i) => ({
        title: (
          t: GetTextCallback
        ) => t('core.components.type.value', 'Title') +
          ` ${i + 1} (h${i + 1})`,
        value: `h${i + 1}`,
      })),
    }, {
      type: 'textarea',
      key: 'content',
      default: '',
      label: (
        t: GetTextCallback
      ) => t('core.components.title.settings.content.title', 'Content'),
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

export const textComponent = (props?: ComponentObject): ComponentObject => ({
  id: 'text',
  name: (t: GetTextCallback) => t('core.components.text.name', 'Text'),
  type: 'component',
  render: () => null,
  icon: 'multiline',
  options: [],
  settings: {
    title: (
      t: GetTextCallback
    ) => t('core.components.text.settings.title', 'Text options'),
    fields: [{
      type: 'textarea',
      key: 'content',
      default: '',
      label: (
        t: GetTextCallback
      ) => t('core.components.text.settings.content.title', 'Content'),
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

export const imageComponent = (props?: ComponentObject): ComponentObject => ({
  id: 'image',
  name: (t: GetTextCallback) => t('core.components.image.name', 'Image'),
  type: 'component',
  render: () => null,
  icon: 'image',
  editable: true,
  options: [],
  settings: {
    title: (
      t: GetTextCallback
    ) => t('core.components.image.settings.title', 'Image options'),
    fields: [{
      type: 'image',
      key: ['url', 'name'],
      default: '',
      label: (
        t: GetTextCallback
      ) => t('core.components.image.settings.image.title', 'Image URL'),
      priority: 50,
    }, {
      type: 'select',
      key: 'settings.size',
      label: (t: GetTextCallback) => t(
        'core.components.image.settings.image.size.title',
        'Image size'
      ),
      default: 'auto',
      displayable: true,
      options: [{
        title: (t: GetTextCallback) => t(
          'core.components.image.settings.image.size.auto',
          'Adapted to content'
        ),
        value: 'auto',
      }, {
        title: (t: GetTextCallback) => t(
          'core.components.image.settings.image.size.full',
          'Real size'
        ),
        value: 'full',
      }, {
        title: (t: GetTextCallback) => t(
          'core.components.image.settings.image.size.custom',
          'Custom'
        ),
        value: 'custom',
      }],
      priority: 40,
    }, {
      type: 'text',
      key: 'settings.width',
      displayable: true,
      condition: (element: ElementObject) =>
        element?.settings?.size === 'custom',
      label: (t: GetTextCallback) => t(
        'core.components.image.settings.image.size.width',
        'Image width'
      ),
      placeholder: (t: GetTextCallback) => t(
        'core.components.image.settings.image.size.width',
        'Image width'
      ),
      priority: 30,
    }, {
      type: 'text',
      key: 'settings.height',
      displayable: true,
      condition: (element: ElementObject) =>
        element?.settings?.size === 'custom',
      label: (t: GetTextCallback) => t(
        'core.components.image.settings.image.size.height',
        'Image height'
      ),
      placeholder: (t: GetTextCallback) => t(
        'core.components.image.settings.image.size.height',
        'Image height'
      ),
      priority: 20,
    }, {
      type: 'select',
      key: 'settings.textAlign',
      displayable: true,
      label: (t: GetTextCallback) => t(
        'core.components.image.settings.image.align.title',
        'Image alignment'
      ),
      default: 'left',
      options: [{
        title: (t: GetTextCallback) => t(
          'core.components.image.settings.image.align.left',
          'Left'
        ),
        value: 'left',
      }, {
        title: (t: GetTextCallback) => t(
          'core.components.image.settings.image.align.center',
          'Center'
        ),
        value: 'center',
      }, {
        title: (t: GetTextCallback) => t(
          'core.components.image.settings.image.align.right',
          'Right'
        ),
        value: 'right',
      }],
      priority: 10,
    }],
  },
  construct: () => ({
    type: 'image',
    url: '',
    name: '',
  }),
  ...props,
});

export const buttonComponent = (props?: ComponentObject): ComponentObject => ({
  id: 'button',
  name: (t: GetTextCallback) => t('core.components.button.name', 'Button'),
  type: 'component',
  render: () => null,
  icon: 'button',
  options: [],
  settings: {
    title: (
      t: GetTextCallback
    ) => t('core.components.button.settings.title', 'Button options'),
    fields: [{
      type: 'textarea',
      key: 'content',
      default: '',
      label: (
        t: GetTextCallback
      ) => t('core.components.button.settings.content.title', 'Content'),
      priority: 50,
    }, {
      type: 'select',
      key: 'action',
      default: 'link',
      displayable: true,
      label: (
        t: GetTextCallback
      ) => t('core.components.button.settings.action.title', 'Action'),
      options: [{
        title: (t: GetTextCallback) => t(
          'core.components.button.settings.action.openLink',
          'Open a link'
        ),
        value: 'link',
      }, {
        title: (t: GetTextCallback) => t(
          'core.components.button.settings.action.fireEvent',
          'Trigger an event'
        ),
        value: 'event',
      }],
      priority: 40,
    }, {
      type: 'text',
      key: 'url',
      default: '',
      placeholder: 'https://example.com',
      displayable: true,
      label: (
        t: GetTextCallback
      ) => t('core.components.button.settings.url.title', 'Link URL'),
      condition: (element: ElementObject) => element.action === 'link',
      priority: 30,
    }, {
      type: 'select',
      key: 'target',
      default: '_self',
      displayable: true,
      placeholder: 'https://example.com',
      label: (t: GetTextCallback) => t(
        'core.components.button.settings.target.title',
        'Target'
      ),
      condition: (element: ElementObject) => element.action === 'link',
      options: [{
        title: (t: GetTextCallback) => t(
          'core.components.button.settings.target.self',
          'Same window'
        ),
        value: '_self',
      }, {
        title: (t: GetTextCallback) => t(
          'core.components.button.settings.target.blank',
          'New window'
        ),
        value: '_blank',
      }],
      priority: 20,
    }, {
      type: 'text',
      key: 'event',
      default: '',
      displayable: true,
      label: (t: GetTextCallback) => t(
        'core.components.button.settings.event.title',
        'Javascript event name'
      ),
      condition: (element: ElementObject) => element.action === 'event',
      priority: 10,
    }, {
      type: 'select',
      key: 'settings.buttonType',
      default: 'button',
      label: (t: GetTextCallback) => t(
        'core.components.button.settings.type.title',
        'HTML element type'
      ),
      options: [{
        title: (
          t: GetTextCallback
        ) => t('core.components.button.settings.type.button', '<button>'),
        value: 'button',
      }, {
        title: (
          t: GetTextCallback
        ) => t('core.components.button.settings.type.links', '<a>'),
        value: 'link',
      }],
      priority: 1,
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

export const foldableComponent = (
  props?: ComponentObject
): ComponentObject => ({
  id: 'foldable',
  name: (t: GetTextCallback) => t('core.components.foldable.name', 'Foldable'),
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
    title: (t: GetTextCallback) => t(
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
      label: (t: GetTextCallback) => t(
        'core.components.foldable.settings.seeMorePosition.title',
        'See more placement'
      ),
      options: [{
        title: (t: GetTextCallback) => t(
          'core.components.foldable.settings.seeMorePosition.before',
          'Before'
        ),
        value: 'before',
      }, {
        title: (t: GetTextCallback) => t(
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

export const clickableComponent = (
  props?: ComponentObject
): ComponentObject => ({
  id: 'clickable',
  name: (t: GetTextCallback) =>
    t('core.components.clickable.name', 'Clickable'),
  type: 'component',
  render: () => null,
  icon: 'clickable',
  editable: true,
  hasCustomInnerContent: true,
  draggable: false,
  droppable: false,
  getContainers: element => [element.content as ElementObject[]],
  options: [],
  disallow: ['clickable'],
  settings: {
    title: (t: GetTextCallback) => t(
      'core.components.clickable.settings.title',
      'Clickable options'
    ),
    floatingSettings: {
      placement: 'right-start',
      autoPlacement: {
        alignment: 'start',
      },
    },
    fields: [{
      type: 'select',
      key: 'action',
      default: 'link',
      displayable: true,
      label: (t: GetTextCallback) => t(
        'core.components.clickable.settings.action.title',
        'Action'
      ),
      options: [{
        title: (t: GetTextCallback) => t(
          'core.components.clickable.settings.action.openLink',
          'Open a link'
        ),
        value: 'link',
      }, {
        title: (t: GetTextCallback) => t(
          'core.components.clickable.settings.action.fireEvent',
          'Trigger an event'
        ),
        value: 'event',
      }],
    }, {
      type: 'text',
      key: 'url',
      default: '',
      placeholder: 'https://example.com',
      displayable: true,
      label: (t: GetTextCallback) => t(
        'core.components.clickable.settings.url.title',
        'Link URL'
      ),
      condition: (element: ElementObject) => element.action === 'link',
    }, {
      type: 'select',
      key: 'target',
      default: '_self',
      displayable: true,
      label: (t: GetTextCallback) => t(
        'core.components.clickable.settings.target.title',
        'Link target'
      ),
      condition: (element: ElementObject) => element.action === 'link',
      options: [{
        title: (t: GetTextCallback) => t(
          'core.components.clickable.settings.target.self',
          'Same window'
        ),
        value: '_self',
      }, {
        title: (t: GetTextCallback) => t(
          'core.components.clickable.settings.target.blank',
          'New window'
        ),
        value: '_blank',
      }],
    }, {
      type: 'text',
      key: 'event',
      default: '',
      displayable: true,
      label: (t: GetTextCallback) => t(
        'core.components.clickable.settings.event.title',
        'Javascript event name'
      ),
      condition: (element: ElementObject) => element.action === 'event',
    }],
  },
  construct: () => ({
    type: 'clickable',
    action: 'link',
    url: '',
    content: [],
  }),
  ...props,
});

const BORDER_STYLE_OPTIONS: ComponentSettingsFieldOptionObject[] = [{
  title: (
    t: GetTextCallback
  ) => t('core.styling.borders.style.solid', 'Solid'),
  value: 'solid',
}, {
  title: (
    t: GetTextCallback
  ) => t('core.styling.borders.style.dashed', 'Dashed'),
  value: 'dashed',
}, {
  title: (
    t: GetTextCallback
  ) => t('core.styling.borders.style.dotted', 'Dotted'),
  value: 'dotted',
}, {
  title: (
    t: GetTextCallback
  ) => t('core.styling.borders.style.double', 'Double'),
  value: 'double',
}, {
  title: (
    t: GetTextCallback
  ) => t('core.styling.borders.style.groove', 'Groove'),
  value: 'groove',
}, {
  title: (
    t: GetTextCallback
  ) => t('core.styling.borders.style.ridge', 'Ridge'),
  value: 'ridge',
}, {
  title: (
    t: GetTextCallback
  ) => t('core.styling.borders.style.inset', 'Inset'),
  value: 'inset',
}, {
  title: (
    t: GetTextCallback
  ) => t('core.styling.borders.style.outset', 'Outset'),
  value: 'outset',
}];

export const stylingSettingsFields = (
  keyPrefix: string = 'styles'
): ComponentSettingsFieldObject[] => [{
  type: 'field',
  key: keyPrefix + '.padding',
  priority: 90,
  label: (
    t: GetTextCallback
  ) => t('core.styling.paddings.title', 'Inside spacing (padding)'),
  fields: [{
    type: 'text',
    key: keyPrefix + '.paddingTop',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.paddings.top', 'Top'),
  }, {
    type: 'text',
    key: keyPrefix + '.paddingRight',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.paddings.right', 'Right'),
  }, {
    type: 'text',
    key: keyPrefix + '.paddingBottom',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.paddings.bottom', 'Bottom'),
  }, {
    type: 'text',
    key: keyPrefix + '.paddingLeft',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.paddings.left', 'Left'),
  }],
}, {
  type: 'field',
  key: keyPrefix + '.margin',
  priority: 80,
  label: (
    t: GetTextCallback
  ) => t('core.styling.margins.title', 'Outside spacing (margin)'),
  fields: [{
    type: 'text',
    key: keyPrefix + '.marginTop',
    placeholder: (t: GetTextCallback) => t('core.styling.margins.top', 'Top'),
  }, {
    type: 'text',
    key: keyPrefix + '.marginRight',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.margins.right', 'Right'),
  }, {
    type: 'text',
    key: keyPrefix + '.marginBottom',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.margins.bottom', 'Bottom'),
  }, {
    type: 'text',
    key: keyPrefix + '.marginLeft',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.margins.left', 'Left'),
  }],
}, {
  type: 'field',
  key: keyPrefix + '.borderWidth',
  priority: 70,
  label: (
    t: GetTextCallback
  ) => t('core.styling.borders.title', 'Border size'),
  fields: [{
    type: 'text',
    key: keyPrefix + '.borderTop',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.top', 'Top'),
  }, {
    type: 'text',
    key: keyPrefix + '.borderRight',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.right', 'Right'),
  }, {
    type: 'text',
    key: keyPrefix + '.borderBottom',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.bottom', 'Bottom'),
  }, {
    type: 'text',
    key: keyPrefix + '.borderLeft',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.left', 'Left'),
  }],
}, {
  type: 'field',
  key: keyPrefix + '.borderColor',
  priority: 60,
  label: (
    t: GetTextCallback
  ) => t('core.styling.borders.color', 'Border color'),
  condition: (element: ElementObject) =>
    get(element, keyPrefix)?.borderTop ||
    get(element, keyPrefix)?.borderRight ||
    get(element, keyPrefix)?.borderBottom ||
    get(element, keyPrefix)?.borderLeft,
  fields: [{
    type: 'color',
    key: keyPrefix + '.borderTopColor',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.topColor', '#000'),
  }, {
    type: 'color',
    key: keyPrefix + '.borderRightColor',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.rightColor', '#000'),
  }, {
    type: 'color',
    key: keyPrefix + '.borderBottomColor',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.bottomColor', '#000'),
  }, {
    type: 'color',
    key: keyPrefix + '.borderLeftColor',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.leftColor', '#000'),
  }],
}, {
  type: 'field',
  key: keyPrefix + '.borderStyle',
  priority: 50,
  condition: (element: ElementObject) =>
    get(element, keyPrefix)?.borderTop ||
    get(element, keyPrefix)?.borderRight ||
    get(element, keyPrefix)?.borderBottom ||
    get(element, keyPrefix)?.borderLeft,
  label: (
    t: GetTextCallback
  ) => t('core.styling.borders.style', 'Border style'),
  fields: [{
    type: 'select',
    key: keyPrefix + '.borderTopStyle',
    default: 'solid',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.topStyle', 'Top'),
    options: BORDER_STYLE_OPTIONS,
  }, {
    type: 'select',
    key: keyPrefix + '.borderRightStyle',
    default: 'solid',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.rightStyle', 'Right'),
    options: BORDER_STYLE_OPTIONS,
  }, {
    type: 'select',
    key: keyPrefix + '.borderBottomStyle',
    default: 'solid',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.bottomStyle', 'Bottom'),
    options: BORDER_STYLE_OPTIONS,
  }, {
    type: 'select',
    key: keyPrefix + '.borderLeftStyle',
    default: 'solid',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borders.leftStyle', 'Left'),
    options: BORDER_STYLE_OPTIONS,
  }],
}, {
  type: 'field',
  key: keyPrefix + '.borderRadius',
  priority: 40,
  label: (
    t: GetTextCallback
  ) => t('core.styling.borderRadius.title', 'Border radius'),
  fields: [{
    type: 'text',
    key: keyPrefix + '.borderTopLeftRadius',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borderRadius.topLeft', 'Top left'),
  }, {
    type: 'text',
    key: keyPrefix + '.borderTopRightRadius',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borderRadius.topRight', 'Top right'),
  }, {
    type: 'text',
    key: keyPrefix + '.borderBottomRightRadius',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borderRadius.bottomRight', 'Bottom right'),
  }, {
    type: 'text',
    key: keyPrefix + '.borderBottomLeftRadius',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.borderRadius.bottomLeft', 'Bottom left'),
  }],
}, {
  type: 'image',
  key: keyPrefix + '.backgroundImage',
  priority: 30,
  label: (
    t: GetTextCallback
  ) => t('core.styling.background.image.title', 'Background image URL'),
}, {
  type: 'field',
  key: keyPrefix + '.backgroundSettings',
  priority: 25,
  fields: [{
    label: (
      t: GetTextCallback
    ) => t('core.styling.background.size.title', 'Background size'),
    key: keyPrefix + '.backgroundSize',
    type: 'select',
    default: 'default',
    placeholder: (t: GetTextCallback) =>
      t('core.styling.background.size.title', 'Background size'),
    options: [{
      title: (
        t: GetTextCallback
      ) => t('core.styling.background.size.default', 'Default'),
      value: 'default',
    }, {
      title: (
        t: GetTextCallback
      ) => t('core.styling.background.size.cover', 'Fill'),
      value: 'cover',
    }, {
      title: (
        t: GetTextCallback
      ) => t('core.styling.background.size.contain', 'Fit'),
      value: 'contain',
    }],
  }, {
    label: (
      t: GetTextCallback
    ) => t('core.styling.background.position.title', 'Background position'),
    key: keyPrefix + '.backgroundPosition',
    type: 'select',
    default: 'center',
    placeholder: (t: GetTextCallback) =>
      t('core.styling.background.position.title', 'Background position'),
    options: [{
      title: (
        t: GetTextCallback
      ) => t('core.styling.background.position.center', 'Centered'),
      value: 'center',
    }, {
      title: (
        t: GetTextCallback
      ) => t('core.styling.background.position.top', 'Top'),
      value: 'top',
    }, {
      title: (
        t: GetTextCallback
      ) => t('core.styling.background.position.right', 'Right'),
      value: 'right',
    }, {
      title: (
        t: GetTextCallback
      ) => t('core.styling.background.position.bottom', 'Bottom'),
      value: 'bottom',
    }, {
      title: (
        t: GetTextCallback
      ) => t('core.styling.background.position.left', 'Left'),
      value: 'left',
    }, {
      title: (t: GetTextCallback) =>
        t('core.styling.background.position.centerTop', 'Center top'),
      value: 'center top',
    }, {
      title: (t: GetTextCallback) =>
        t('core.styling.background.position.centerBottom', 'Center bottom'),
      value: 'center bottom',
    }, {
      title: (t: GetTextCallback) =>
        t('core.styling.background.position.leftCenter', 'Center left'),
      value: 'left center',
    }, {
      title: (t: GetTextCallback) =>
        t('core.styling.background.position.leftTop', 'Top left'),
      value: 'left top',
    }, {
      title: (t: GetTextCallback) =>
        t('core.styling.background.position.leftBottom', 'Bottom left'),
      value: 'left bottom',
    }, {
      title: (t: GetTextCallback) =>
        t('core.styling.background.position.rightCenter', 'Center right'),
      value: 'right center',
    }, {
      title: (t: GetTextCallback) =>
        t('core.styling.background.position.rightTop', 'Top right'),
      value: 'right top',
    }, {
      title: (t: GetTextCallback) =>
        t('core.styling.background.position.rightBottom', 'Bottom right'),
      value: 'right bottom',
    }],
  }, {
    label: (
      t: GetTextCallback
    ) => t('core.styling.background.repeat.title', 'Background repeat'),
    key: keyPrefix + '.backgroundRepeat',
    type: 'select',
    default: 'no-repeat',
    placeholder: (t: GetTextCallback) =>
      t('core.styling.background.repeat.title', 'Background repeat'),
    options: [{
      title: (t: GetTextCallback) =>
        t('core.styling.background.repeat.noRepeat', 'No repeat'),
      value: 'no-repeat',
    }, {
      title: (t: GetTextCallback) =>
        t('core.styling.background.repeat.repeatX', 'Repeat horizontally'),
      value: 'repeat-x',
    }, {
      title: (t: GetTextCallback) =>
        t('core.styling.background.repeat.repeatY', 'Repeat vertically'),
      value: 'repeat-y',
    }, {
      title: (t: GetTextCallback) => t('core.styling.background.repeat.both',
        'Repeat horizontally & vertically'),
      value: 'repeat',
    },
    ],
  }],
}, {
  label: (t: GetTextCallback) =>
    t('core.styling.background.color.title', 'Background color'),
  placeholder: '#FFF',
  type: 'color',
  key: keyPrefix + '.backgroundColor',
  priority: 20,
}, {
  type: 'field',
  key: keyPrefix + '.boxShadow',
  priority: 10,
  label: (
    t: GetTextCallback
  ) => t('core.styling.shadow.title', 'Box shadow'),
  fields: [{
    type: 'text',
    key: keyPrefix + '.boxShadowX',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.shadow.x', 'X'),
  }, {
    type: 'text',
    key: keyPrefix + '.boxShadowY',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.shadow.y', 'Y'),
  }, {
    type: 'text',
    key: keyPrefix + '.boxShadowBlur',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.shadow.blur', 'Blur'),
  }, {
    type: 'text',
    key: keyPrefix + '.boxShadowSpread',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.shadow.spread', 'Spread'),
  }, {
    type: 'color',
    key: keyPrefix + '.boxShadowColor',
    placeholder: (
      t: GetTextCallback
    ) => t('core.styling.shadow.color', '#000'),
  }],
}];

export const stylingSettings = (
  props?: ComponentSettingsFieldObject,
): ComponentSettingsFieldObject => ({
  id: 'styling',
  type: 'tab',
  title: (t: GetTextCallback) => t('core.styling.title', 'Styling'),
  ...props,
  fields: [
    ...(props?.fields || []),
    ...stylingSettingsFields('styles'),
    {
      label: (t: GetTextCallback) =>
        t('core.styling.className.title', 'Additional CSS class'),
      type: 'text',
      placeholder: 'my-button',
      key: 'settings.className',
      priority: 0,
    },
    {
      key: 'styles.hover',
      type: 'group',
      label: (t: GetTextCallback) =>
        t('core.styling.hover.title', 'Hover styles'),
      condition: (element: ElementObject) =>
        element?.type === 'button',
      fields: [
        ...stylingSettingsFields('styles.hover'),
        {
          label: (t: GetTextCallback) =>
            t('core.styling.hover.className.title', 'Hover CSS class'),
          type: 'text',
          placeholder: 'my-button--hover',
          key: 'settings.hoverClassName',
          priority: 0,
        },
      ],
    },
    {
      key: 'styles.active',
      type: 'group',
      label: (t: GetTextCallback) =>
        t('core.styling.active.title', 'Active styles'),
      condition: (element: ElementObject) =>
        element?.type === 'button',
      fields: [
        ...stylingSettingsFields('styles.active'),
        {
          label: (t: GetTextCallback) =>
            t('core.styling.active.className.title', 'Active CSS class'),
          type: 'text',
          placeholder: 'my-button--active',
          key: 'settings.activeClassName',
          priority: 0,
        },
      ],
    },
  ],
});
export const darkStylingSettings = (
  props?: ComponentSettingsFieldObject,
): ComponentSettingsFieldObject[] => ([{
  id: 'styling',
  type: 'tab',
  title: (t: GetTextCallback) => t('core.styling.title', 'Styling'),
  ...props,
  fields: [],
}, {
  type: 'tab',
  id: 'default-mode',
  tab: 'styling',
  title: 'Default Mode Settings',
  fields: stylingSettingsFields('styles'),
},{
  type: 'tab',
  id: 'dark-mode',
  tab: 'styling',
  title: 'Dark Mode Settings',
  fields: stylingSettingsFields('styles.dark'),
}]);
export const responsiveSettings = (
  props?: ComponentSettingsFieldObject
): ComponentSettingsFieldObject => ({
  id: 'responsive',
  type: 'tab',
  key: 'responsive',
  title: (t: GetTextCallback) => t('core.responsive.title', 'Responsive'),
  ...props,
  fields: [...(props?.fields || []), {
    key: 'responsive.xl',
    priority: 40,
    type: 'select',
    label: (
      t: GetTextCallback
    ) => t('core.responsive.xl', 'Extra-large screens'),
    default: 'show',
    options: [{
      title: (t: GetTextCallback) => t('core.responsive.show', 'Visible'),
      value: 'show',
    }, {
      title: (t: GetTextCallback) => t('core.responsive.hide', 'Hidden'),
      value: 'hide',
    }],
    condition: (_, { component }: { component?: ComponentObject} = {}) =>
      (component.settings as ComponentSettingsFormObject)
        ?.defaults?.responsive !== false,
  }, {
    key: 'responsive.lg',
    type: 'select',
    priority: 30,
    label: (
      t: GetTextCallback
    ) => t('core.responsive.lg', 'Large screens (desktop)'),
    default: 'show',
    options: [{
      title: (t: GetTextCallback) => t('core.responsive.show', 'Visible'),
      value: 'show',
    }, {
      title: (t: GetTextCallback) => t('core.responsive.hide', 'Hidden'),
      value: 'hide',
    }],
    condition: (_, { component }: { component?: ComponentObject} = {}) =>
      (component.settings as ComponentSettingsFormObject)
        ?.defaults?.responsive !== false,
  }, {
    key: 'responsive.md',
    type: 'select',
    priority: 20,
    label: (
      t: GetTextCallback
    ) => t('core.responsive.md', 'Medium screens (tablet)'),
    default: 'show',
    options: [{
      title: (t: GetTextCallback) => t('core.responsive.show', 'Visible'),
      value: 'show',
    }, {
      title: (t: GetTextCallback) => t('core.responsive.hide', 'Hidden'),
      value: 'hide',
    }],
    condition: (_, { component }: { component?: ComponentObject} = {}) =>
      (component.settings as ComponentSettingsFormObject)
        ?.defaults?.responsive !== false,
  }, {
    key: 'responsive.sm',
    type: 'select',
    priority: 10,
    label: (
      t: GetTextCallback
    ) => t('core.responsive.sm', 'Small screens (phones)'),
    default: 'show',
    options: [{
      title: (t: GetTextCallback) => t('core.responsive.show', 'Visible'),
      value: 'show',
    }, {
      title: (t: GetTextCallback) => t('core.responsive.hide', 'Hidden'),
      value: 'hide',
    }],
    condition: (_, { component }: { component?: ComponentObject} = {}) =>
      (component.settings as ComponentSettingsFormObject)
        ?.defaults?.responsive !== false,
  }, {
    key: 'responsive.xs',
    type: 'select',
    priority: 1,
    label: (
      t: GetTextCallback
    ) => t('core.responsive.xs', 'Extra-small screens (old phones)'),
    default: 'show',
    options: [{
      title: (t: GetTextCallback) => t('core.responsive.show', 'Visible'),
      value: 'show',
    }, {
      title: (t: GetTextCallback) => t('core.responsive.hide', 'Hidden'),
      value: 'hide',
    }],
    condition: (_, { component }: { component?: ComponentObject} = {}) =>
      (component.settings as ComponentSettingsFormObject)
        ?.defaults?.responsive !== false,
  }],
});

export const accessibilitySettings = (
  props?: ComponentSettingsFieldObject
): ComponentSettingsFieldObject => ({
  id: 'accessibility',
  type: 'tab',
  key: 'accessibility',
  title: (t: GetTextCallback) => t('core.accessibility.title', 'Accessibility'),
  ...props,
  fields: [...(props?.fields || []), {
    label: (t: GetTextCallback) =>
      t('core.accessibility.dir.title', 'Text direction'),
    type: 'select',
    key: 'settings.dir',
    default: 'ltr',
    options: [{
      title: (t: GetTextCallback) =>
        t('core.accessibility.dir.ltr', 'Left to right'),
      value: 'ltr',
    }, {
      title: (t: GetTextCallback) =>
        t('core.accessibility.dir.rtl', 'Right to left'),
      value: 'rtl',
    }],
    condition: (element: ElementObject) =>
      ['title', 'text', 'button', 'textarea'].includes(element.type),
    priority: 30,
  }, {
    type: 'text',
    key: 'settings.alt',
    label: (t: GetTextCallback) => t(
      'core.components.image.settings.image.alt.title',
      'Image alternative text'
    ),
    condition: (element: ElementObject) => element.type === 'image',
    priority: 20,
  }, {
    type: 'textarea',
    key: 'settings.description',
    label: (t: GetTextCallback) => t(
      'core.components.image.settings.image.description.title',
      'Image description'
    ),
    condition: (element: ElementObject) => element.type === 'image',
    priority: 10,
  }, {
    type: 'select',
    key: 'settings.role',
    label: (t: GetTextCallback) => t(
      'core.accessibility.role.title', 'ARIA role'),
    default: elmt => elmt.type === 'button' ? 'button' : '',
    options: [{
      title: (t: GetTextCallback) => t(
        'core.accessibility.role.none', 'None'),
      value: '',
    }, {
      title: (t: GetTextCallback) => t(
        'core.accessibility.role.button', 'Button'),
      value: 'button',
    }, {
      title: (t: GetTextCallback) => t(
        'core.accessibility.role.link', 'Link'),
      value: 'link',
    }],
    condition: (element: ElementObject) =>
      ['button', 'clickable'].includes(element.type),
    priority: 10,
  }],
  condition: (element: ElementObject) => [
    'title', 'text', 'textarea', 'button', 'clickable', 'image',
  ].includes(element.type),
});

export const baseFields = (): FieldObject[] => [
  textField(),
  textareaField(),
  selectField(),
  colorField(),
  imageField(),
  dateField(),
  toggleField(),
];

export const baseComponents = (): ComponentObject[] => [
  rowComponent(),
  colComponent(),
  emptySpaceComponent(),
  titleComponent(),
  textComponent(),
  imageComponent(),
  buttonComponent(),
  foldableComponent(),
  clickableComponent(),
];

export const baseSettings = (
  { darkMode = false }: { darkMode?: boolean } = {}
): ComponentSettingsFieldObject[] => [
  ...(darkMode ? darkStylingSettings() : [stylingSettings()]),
  responsiveSettings(),
  accessibilitySettings(),
];

export const coreComponentsGroup = (
  props?: ComponentsGroupObject
): ComponentsGroupObject => ({
  id: 'core',
  type: 'group',
  name: (
    t: GetTextCallback
  ) => t('core.components.core.title', 'Core components'),
  components: baseComponents(),
  ...props,
});

export const baseAddon = (
  { darkMode = false }: { darkMode?: boolean } = {}
): AddonObject => ({
  components: [coreComponentsGroup()],
  fields: baseFields(),
  settings: baseSettings({ darkMode }),
});
