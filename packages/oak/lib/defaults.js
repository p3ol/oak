import { classNames } from '@poool/junipero-utils';

export const COMPONENT_DEFAULT = {
  id: 'unknown',
  name: t => t('core.components.unknown.title', 'Unknown'),
  type: 'component',
  render: ({ element, className }) => (
    <pre className={classNames('oak-unknown', className)}>
      { JSON.stringify(element) }
    </pre>
  ),
};

export const DEFAULT_SETTINGS = {
  title: t => t('core.settings.title', 'Settings'),
  fields: [],
};

export const DEFAULT_STYLES_SETTINGS = {
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
    label: t => t('core.styling.margins.title', 'Outside spacings'),
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
      type: 'core-image',
    }, {
      label: t => t('core.styling.background.size.title', 'Size'),
      key: 'styles.backgroundSize',
      type: 'select',
      default: 'default',
      placeholder: t =>
        t('core.styling.background.size.title', 'Background size'),
      options: [{
        title: t => t('core.styling.background.size.default', 'By default'),
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
        title: t => t('core.styling.background.position.center', 'Center'),
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
          t('core.styling.background.position.leftTop', 'Left top'),
        value: 'left top',
      }, {
        title: t =>
          t('core.styling.background.position.leftBottom', 'Left bottom'),
        value: 'left bottom',
      }, {
        title: t =>
          t('core.styling.background.position.rightCenter', 'Center right'),
        value: 'right center',
      }, {
        title: t =>
          t('core.styling.background.position.rightTop', 'Right top'),
        value: 'right top',
      }, {
        title: t =>
          t('core.styling.background.position.rightBottom', 'Right bottom'),
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

export const DEFAULT_RESPONSIVE_SETTINGS = {
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
