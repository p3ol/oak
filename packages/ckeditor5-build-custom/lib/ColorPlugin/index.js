import { createRoot } from 'react-dom/client';
import { Plugin } from '@ckeditor/ckeditor5-core';
import { createDropdown } from '@ckeditor/ckeditor5-ui';
import FontColorCommand from '@ckeditor/ckeditor5-font/src/fontcolor/fontcolorcommand.js';
import icon from '@ckeditor/ckeditor5-font/theme/icons/font-color.svg';

import Field from './Field';

export default class ColorPlugin extends Plugin {
  static pluginName = 'ColorPlugin';

  init () {
    this.defineSchema();
    this.defineCommands();
    this.defineConversion();
    this.defineToolbar();
  }

  defineSchema () {
    const schema = this.editor.model.schema;
    schema.extend('$text', { allowAttributes: 'color' });
  }

  defineCommands () {
    const editor = this.editor;
    editor.commands.add('fontColor', new FontColorCommand(editor));
  }

  defineConversion () {
    const conversion = this.editor.conversion;

    conversion.for('upcast').attributeToAttribute({
      view: {
        name: 'span',
        styles: {
          color: /[\s\S]+/,
        },
      },
      model: {
        key: 'color',
        value: viewElement => viewElement.getStyle('color'),
      },
    });

    conversion.for('downcast').attributeToAttribute({
      model: 'color',
      view: modelAttributeValue => ({
        key: 'style',
        value: {
          color: modelAttributeValue,
        },
      }),
    });
  }

  defineToolbar () {
    const editor = this.editor;

    editor.ui.componentFactory.add('fontColor', locale => {
      const dropdown = createDropdown(locale);
      dropdown.set({
        class: 'ck-font-color-dropdown',
      });

      dropdown.buttonView.set({
        label: 'Color',
        tooltip: true,
        icon,
      });

      let root;
      dropdown.panelView.on('render', () => {
        root = createRoot(dropdown.panelView.element);
      });

      dropdown.buttonView.on('open', () => {
        dropdown.buttonView.labelView.destroy();
      });

      dropdown.on('change:isOpen', () => {
        const key = Math.random().toString(36).substring(7);

        if (dropdown.isOpen) {
          root.render(<Field key={key} editor={this.editor} />);
        }
      });

      return dropdown;
    });
  }
}
