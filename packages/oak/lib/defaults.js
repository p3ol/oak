import { classNames } from '@poool/junipero-utils';

export const COMPONENT_DEFAULT = {
  id: 'unknown',
  name: 'Unknown',
  type: 'component',
  render: ({ element, className }) => (
    <pre className={classNames('oak-unknown', className)}>
      { JSON.stringify(element) }
    </pre>
  ),
};

export const DEFAULT_STYLES_SETTINGS = {
  fields: [{
    label: 'Paddings',
    fields: [{
      type: 'text',
      key: 'styles.paddingTop',
      placeholder: 'Top',
    }, {
      type: 'text',
      key: 'styles.paddingRight',
      placeholder: 'Right',
    }, {
      type: 'text',
      key: 'styles.paddingBottom',
      placeholder: 'Bottom',
    }, {
      type: 'text',
      key: 'styles.paddingLeft',
      placeholder: 'Left',
    }],
  }, {
    label: 'Margins',
    fields: [{
      type: 'text',
      key: 'styles.marginTop',
      placeholder: 'Top',
    }, {
      type: 'text',
      key: 'styles.marginRight',
      placeholder: 'Right',
    }, {
      type: 'text',
      key: 'styles.marginBottom',
      placeholder: 'Bottom',
    }, {
      type: 'text',
      key: 'styles.marginLeft',
      placeholder: 'Left',
    }],
  }, {
    label: 'Background image',
    fields: [{
      key: 'styles.backgroundImage',
      type: 'core-image',
    }, {
      key: 'styles.backgroundSize',
      type: 'select',
      default: 'default',
      options: [
        { title: 'Default', value: 'default' },
        { title: 'Cover', value: 'cover' },
        { title: 'Contain', value: 'contain' },
      ],
    }, {
      key: 'styles.backgroundPosition',
      type: 'select',
      default: 'center',
      options: [
        { title: 'Center', value: 'center' },
        { title: 'Top', value: 'top' },
        { title: 'Right', value: 'right' },
        { title: 'Bottom', value: 'bottom' },
        { title: 'Left', value: 'left' },
        { title: 'Center top', value: 'center top' },
        { title: 'Center bottom', value: 'center bottom' },
        { title: 'Left top', value: 'left top' },
        { title: 'Left bottom', value: 'left bottom' },
        { title: 'Right top', value: 'right top' },
        { title: 'Right bottom', value: 'right bottom' },
      ],
    }, {
      key: 'styles.backgroundRepeat',
      type: 'select',
      default: 'no-repeat',
      options: [
        { title: 'No repeat', value: 'no-repeat' },
        { title: 'Repeat horizontally', value: 'repeat-x' },
        { title: 'Repeat vertically', value: 'repeat-x' },
        { title: 'Repeat both horizontally & vertically', value: 'repeat' },
      ],
    }],
  }, {
    label: 'Background color',
    type: 'color',
    key: 'styles.backgroundColor',
  }],
};
