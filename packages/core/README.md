<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.junipero.design/images/oak-logo-light.svg" />
  <img src="https://cdn.junipero.design/images/oak-logo.svg" height="50" />
</picture>

<br />
<br />

[![GitHub](https://img.shields.io/github/license/p3ol/oak.svg)](https://github.com/p3ol/oak)
[![npm](https://img.shields.io/npm/v/@oakjs/core.svg)](https://www.npmjs.com/package/@oakjs/core)
[![CI](https://github.com/p3ol/oak/actions/workflows/ci.yml/badge.svg)](https://github.com/p3ol/oak/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/p3ol/oak/branch/master/graph/badge.svg)](https://codecov.io/gh/p3ol/oak)

<br />
<p>Modern, lightweight &amp; modulable page builder</p>

</div>

ℹ️ This package is probably not what you're looking for, unless you're building a renderer for your favorite framework or you're creating a shiny addon.

## Installation

```bash
yarn add @oakjs/core
```

## Usage

```javascript
import { Builder } from '@oakjs/core';

const builder = new Builder();
```

## Documentation

### Options

#### addons
- Type: `Array<AddonObject>`
- Default: `[]`

Adds a list of addons to the page builder. See [addons](#addons) for more information.

```js
new Builder({ addons: [baseAddon()] });
```

#### content
- Type: `Array<ElementObject|Element>`
- Default: `[]`

Default content to add to the builder on init.

```js
new Builder({ content: [{ id: 1, type: 'text', content: 'Foo' }] });
```

#### options
- Type: `BuilderOptions`
- Default: `{}`

Builder options.

```js
new Builder({ options: {} });
```

##### debug
- Type: `boolean`
- Default: `false`

Enable/disable debug mode (more logs).

```js
new Builder({ options: { debug: true } });
```

##### historyLimit
- Type: `number`
- Default: `20`

Maximum count of history items (for undo/redo).

```js
new Builder({ options: { historyLimit: 100 } });
```

##### generateId
- Type: `Function` `generateId(): string`
- Default: `null`

Allows to generate custom unique ids for elements (defaults to `uuidv4()`)

```js
new Builder({ options: { generateId: () => Math.random() } });
```

### Addons

Oak is by definition an empty shell, composed of addons.
Creating addons allows you to add new components, fields, settings or even override some of them, to the core builder.

There are 4 things an addon can create:
- Components: the building blocks of oak, they define the final structure of the elements that will be added to your content
- Fields: field definition used by the settings to edit the configuration of your elements
- Settings: elements settings using field definitions
- Overrides: allow to override (hence the name) some component settings fields, fields props, ...

ℹ️ For things that need to be rendered (e.g components & fields), the renderer will need to extend the addon to 

For example, if you need to add a new `quote` component & a new `enhancedtext` field:

```js
import { Builder } from '@oakjs/core';

const builder = new Builder({
  addons: [{
    components: [{
      id: 'quote',
      name: t => t('customTexts.quote.title', 'Quote component'),
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
    construct: elmt => ({ ...elmt, id: uuid() }),
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