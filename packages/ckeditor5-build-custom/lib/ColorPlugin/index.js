import { createRoot } from 'react-dom/client';
import { Plugin } from '@ckeditor/ckeditor5-core';
import { createDropdown } from '@ckeditor/ckeditor5-ui';
import { Card, ColorField } from '@oakjs/react';

export default class ColorPlugin extends Plugin {
  static pluginName = 'ColorPlugin';

  init () {
    this.defineSchema();
    this.defineConversion();
    this.defineToolbar();
  }

  defineSchema () {
    const schema = this.editor.model.schema;
    schema.extend('$text', { allowAttributes: 'color' });
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
      dropdown.buttonView.set({
        label: 'Color',
        tooltip: true,
        withText: true,
      });

      let root;
      dropdown.panelView.on('render', () => {
        root = createRoot(dropdown.panelView.element);
      });

      dropdown.on('change:isOpen', () => {
        root.render((
          <Card>
            <ColorField opened={true} trigger="manual" />
          </Card>
        ));
      });

      return dropdown;
    });
  }
}
