<div align="center">

<h1>🌳 oak</h1>

[![GitHub](https://img.shields.io/github/license/p3ol/oak.svg)](https://github.com/p3ol/oak)
[![npm](https://img.shields.io/npm/v/@poool/oak.svg)](https://www.npmjs.com/package/@poool/oak)
[![CI](https://github.com/p3ol/oak/actions/workflows/ci.yml/badge.svg)](https://github.com/p3ol/oak/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/p3ol/oak/branch/master/graph/badge.svg)](https://codecov.io/gh/p3ol/oak)

<br />
<p>A page builder for the future of the internet</p>

</div>

## Installation

```bash
yarn add @poool/oak
```

## Usage

```javascript
import { render } from '@poool/oak';

render(document.getElementById('app'), { /* options */ });
```

Don't forget to import styles, for example using `style-loader` and `webpack`:

```javascript
import '@poool/oak/dist/oak.min.css';
```

Or import them directly inside your own styles using `less`, `sass` or `stylus`:

```css
@import "@poool/oak/dist/oak.min.css";
```

## Documentation

### Options

#### addons
- Type: `Array`
- Default: `[]`

Adds a list of addons to add to the page builder. See [addons](#addons) for more information.

#### content
- Type: `Array`
- Default: `[]`

Default content to add to the builder on init.

#### debug
- Type: `Boolean`
- Default: `false`

Enable/disable debug output.

#### events
- Type: `Object`
- Default: `{}`

Event listeners to attach to the builder. See [events](#events) for more information.

#### historyButtonsEnabled
- Type: `Boolean`
- Default: `true`

Enable/disable undo/redo buttons.

#### otherTabEnabled
- Type: `Boolean`
- Default: `true`

Whether to display the `Other components` tab inside the builder's catalogue dropdown.

#### overrides
- Type: `Array`
- Default: `[]`

Defines a list of components to override. See [overrides](#overrides) for more information.

#### settings
- Type: `Object`
- Default: `{}`

Custom settings to add to the components' settings panel. See [settings](#settings) for more information.

#### settingsContainer
- Type: `Node`
- Default: `null`

Element in which to render the components' settings panel.

#### texts
- Type: `Object`
- Default: `{}`

Override texts used by the builder. See [texts](#texts) for more information.

### Addons

Creating addons allows you to add new components or field types to the builder.

An addon is an object with the following format:
```js
{
  components: [{
    id: String,
    name: String|Function,
    type: String,
    render: Function,
    construct: Function,
    icon?: String|Function,
    options?: Object,
    settings?: Object,
    editable?: Boolean,
    duplicate?: Function,
  }],
  fieldTypes: [{
    type: String,
    render: Function,
    default?: Any,
    serialize?: Function,
    deserialize?: Function,
  }]
}
```

For example, if you need to add a new `quote` component & a new `enhancedtext` field type:

```js
import { render } from '@poool/oak';

render(element, {
  addons: [{
    components: [{
      id: 'quote',
      name: translate => translate('customTexts.quote.title', 'Quote component'),
      type: 'component',
      render: ({ content, author }) =>
        `<blockquote>${content}<cite>${author}</cite></blockquote>`,
      construct: () => ({
        type: 'quote',
        content: '',
        author: '',
      }),
      settings: {
        title: translate => translate('customTexts.quote.settings.title',
          'Quote options'),
        fields: [{
          key: 'content',
          type: 'enhancedtext',
          default: '',
          displayable: true,
        }, {
          key: 'author',
          type: 'text',
          displayable: true,
        }],
      },
    }],
    fieldTypes: [{
      type: 'enhancedtext',
      default: '',
      render: (baseProps, customProps) => (
        <textarea { ...customProps } { ...baseProps } />
      ),
    }],
  }],
});
```

If you need to have a look at more complex examples, feel free to take a look at all the addons we have already created in the `packages` folder.

### Events

#### onChange
- Arguments: `({ value: Array }: Object)`

Example:
```js
import { render } from '@poool/oak';

render(element, {
  events: {
    onChange: ({ value }) => console.log(value),
  },
});
```

Called everytime the builder's content changes.

#### onImageUpload
- Arguments: `(event: Event)`

Called when an image is uploaded using the `image` field type. The event argument is the native file `input` event.

Example:
```js
import { render } from '@poool/oak';

render(element, {
  events: {
    onImageUpload: event => {
      const reader = new FileReader();
      const image = e.target.files[0];

      return { url: reader.readAsDataURL(image), name: image.name };
    },
  },
});
```

### Overrides

While addons are great to add new components, you might have to override existing components and their behavior.
That's where `overrides` comes in handy.

There are currently only one type of override:
- `components`: Allows to override the various fields of one or multiple existing component

#### components

A `component` override has the following format:
```js
{
  type: 'component',
  components: Array,
  fields: Array,
  construct?: Function,
  duplicate?: Function,
}
```

For example, if you want to override the `content` field for the `title`, `text` & `button` components and make it a `richtext` field instead of a basic `textarea` (and for the sake of this example, also add a unique ID on creation & duplication):

```js
import { render } from '@poool/oak';

render(element, {
  overrides: [{
    type: 'component',
    components: ['title', 'text', 'button'],
    fields: [{
      key: 'content',
      type: 'richtext',
    }],
    construct: elmt => ({ ...elmt, id: uuid() }),
    duplicate: elmt => ({ ...elmt, id: uuid() }),
  }],
});
```

### Settings

You may also be able to override the various settings tabs for any component.
Note: The settings are merged together and not replaced.

Settings format:
```js
{
  title?: String|Function,
  fields: [{
    key: String,
    type: String,
    default: Any,
    displayable?: Boolean,
    label?: String|Function,
    condition?: Function,
    options?: [{
      title: String|Function,
      value: Any,
    }],
  }],
}
```

For example, if you want to add an `xxs` option to the Responsive settings tab:

```js
import { render } from '@poool/oak';

render(element, {
  settings: {
    responsive: {
      fields: [{
        key: 'responsive.xxs',
        type: 'select',
        label: 'Extra-extra-small screens (your granny\'s phone)',
        default: 'show',
        options: [{
          title: 'Visible',
          value: 'show',
        }, {
          title: 'Hidden',
          value: 'hide',
        }],
      }],
    },
  },
});
})
```

### Texts

Most of the core components & available official addons are already translated in english (default language) & french.
If you need to override all the texts with your own language, it is mostly the same principle as for the settings.

For example, if you need to override the settings panel buttons texts:

```js
import { render } from '@poool/oak';

render(element, {
  texts: {
    core: {
      settings: {
        cancel: 'Annuler',
        save: 'Sauvegarder',
      },
    },
  },
});
```

A full example text object is available inside the `core/languages/fr.js` folder of every package of this repository, including the core library itself.

To use these translations, every `label`, `title` of `name` property inside components, fieldTypes, overrides & settings can either be a string (not translated), or a function, for which the first argument is a function called the `translate` function.
This function is passed to each of these property for you to be able to provide the text key & the default value in your current language.

For example, if you need to add a translated label to one of your custom components' fields:

```js
{
  label: t => t('custom.myComponent.myField.label', 'My field'),
}
```

## Contributing

[![](https://contrib.rocks/image?repo=p3ol/oak)](https://github.com/p3ol/oak/graphs/contributors)

Please check the [CONTRIBUTING.md](https://github.com/p3ol/oak/blob/master/CONTRIBUTING.md) doc for contribution guidelines.


## License

This software is licensed under [MIT](https://github.com/p3ol/oak/blob/master/LICENSE).