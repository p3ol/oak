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

### @oakjs/core
A modern, lightweight & modulable page builder

</div>

ℹ️ This package is probably not what you're looking for, unless you're building a renderer for your favorite framework or you're creating a shiny addon.

# Installation

```bash
yarn add @oakjs/core
```

# Usage

```javascript
import { Builder } from '@oakjs/core';

const builder = new Builder();
```

# Documentation

## Options

### addons
- Type: `Array<AddonObject>`
- Default: `[]`

Adds a list of addons to the page builder. See [addons](#addons) for more information.

```js
new Builder({ addons: [baseAddon()] });
```

### content
- Type: `Array<ElementObject|Element>`
- Default: `[]`

Default content to add to the builder on init.

```js
new Builder({ content: [{ id: 1, type: 'text', content: 'Foo' }] });
```

### options
- Type: `BuilderOptions`
- Default: `{}`

Builder options.

```js
new Builder({ options: {} });
```

#### debug
- Type: `boolean`
- Default: `false`

Enable/disable debug mode (more logs).

```js
new Builder({ options: { debug: true } });
```

#### historyLimit
- Type: `number`
- Default: `20`

Maximum count of history items (for undo/redo).

```js
new Builder({ options: { historyLimit: 100 } });
```

#### generateId
- Type: `Function` `generateId(): string`
- Default: `null`

Allows to generate custom unique ids for elements (defaults to `uuidv4()`)

```js
new Builder({ options: { generateId: () => Math.random() } });
```

## Events

### onChange
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

### onImageUpload
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

## Addons

Oak is by definition an empty shell, composed of addons.
Creating addons allows you to add new components, fields, settings or even override some of them, to the core builder.

There are 4 things an addon can create:
- Components: the building blocks of oak, they define the final structure of the elements that will be added to your content
- Fields: field definition used by the settings to edit the configuration of your elements
- Settings: elements settings using field definitions
- Overrides: allows to override (hence the name) some component settings fields, fields props, ...
- Texts: allows to create localized text sheets for the builder and everything inside

ℹ️ For things that need to be rendered (e.g components & fields), the renderer will need to extend the addon to
add a `render` method.

If you need to have a look at more complex examples than those in this file, feel free to take a look at all the addons we have already created inside the `@oakjs/react` or `@oakjs/addon-ckeditor5-react` packages.

### Components

Type definition: [packages/core/lib/types.d.ts:159](./lib/types.d.ts#L159)

Example for a new `quote` component:

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
        title: t => t('customTexts.quote.settings.title',
          'Quote options'),
        fields: [{
          key: 'content',
          type: 'text',
          default: '',
          displayable: true,
        }, {
          key: 'author',
          type: 'text',
          displayable: true,
        }],
      },
    }],
  }],
});
```

### Fields

Type definition: [packages/core/lib/types.d.ts:34](./lib/types.d.ts#L34)

Example for a new `enhanced-text` field:

```js
import { Builder } from '@oakjs/core';

const builder = new Builder({
  addons: [{
    fields: [{
      type: 'enhanced-text',
      render: (baseProps, customProps) => (
        <textarea { ...customProps } { ...baseProps } />
      ),
    }],
  }],
});
```

### Settings

The settings definition can be split into 2 parts :
- `tabs` ([packages/core/lib/types.d.ts:121](./lib/types.d.ts#L121)): Allows to compile multiple fields in a new settings tab
- `fields` ([packages/core/lib/types.d.ts:85](./lib/types.d.ts#L85)): Allows to add new fields to any tab

Fields not referencing any tab will be displayed in the first tab, aka "Settings".

Example for a new `ariaLabel` setting only available on the `quote` component:

```js
import { Builder } from '@oakjs/core';

const builder = new Builder({
  addons: [{
    settings: [{
      id: 'ariaLabel',
      key: 'settings.ariaLabel',
      type: 'text',
      default: '',
      displayable: true,
      condition: element => element.type === 'quote',
    }],
  }],
});
```

### Overrides

There are currently two type of overrides:
- `components` ([packages/core/lib/types.d.ts:49](./lib/types.d.ts#L49)): Allows to override the various fields or props of one or multiple existing components

For example, if you want to override the `content` field for the `title`, `text` & `button` components and make it a `richtext` field instead of a basic `textarea`:

```js
import { Builder } from '@oakjs/core';

const builder = new Builder({
  addons: [{
    overrides: [{
      type: 'component',
      targets: ['title', 'text', 'button'],
      fields: [{
        key: 'content',
        type: 'richtext',
        placeholder: 'Write something...',
      }],
    }],
  }],
});
```

- `fields` ([packages/core/lib/types.d.ts:70](./lib/types.d.ts#L70)); Allows to override the various props of one or multiple existing fields

For example, if you want to override the `render` method of the `textarea` field to add a text underneath:

```js
import { Builder } from '@oakjs/core';

const builder = new Builder({
  addons: [{
    overrides: [{
      type: 'field',
      targets: ['textarea'],
      render: (fieldProps, customProps) => (
        <div>
          <textarea { ...customProps } { ...fieldProps } />
          <p>Some text underneath</p>
        </div>
      ),
    }],
  }],
});
```

- `settings` ([packages/core/lib/types.d.ts:104](./lib/types.d.ts#L104)); Allows to override the various settings of one or multiple existing components

For example, if you want to override the `placeholder` property of the `settings.className` field for the `title` component:

```js
import { Builder } from '@oakjs/core';

const builder = new Builder({
  addons: [{
    overrides: [{
      type: 'setting',
      targets: ['title'],
      key: 'settings.className',
      placeholder: 'Add a class name...',
    }],
  }],
});
```

### Texts

Type definition: [packages/core/lib/types.d.ts:222](./lib/types.d.ts#L222)

Every text inside the builder can be overriden using a new text sheet passed inside an addon.
For example, if you need to add a french text sheet:

```js
import { Builder } from '@oakjs/core';

const builder = new Builder({
  addons: [{
    texts: [{
      id: 'fr',
      texts: {
        core: {
          settings: {
            cancel: 'Annuler',
            save: 'Sauvegarder',
          },
        },
      }
    }]
  }],
  activeTextSheet: 'fr',
});
```

To use these translations, every `label`, `title` or `name` property inside components, fields, overrides & settings can either be strings (not translated), or functions, for which the first argument is a function called the `translate` function.
This function is passed to each of these property for you to be able to provide the text key & the default value in your current language.

For example, if you need to translate the name of your custom `quote` component:

```js
{
  id: 'quote',
  type: 'component',
  name: t => t('custom.myComponent.myField.label', 'My component'),
}
```

# Contributing

[![](https://contrib.rocks/image?repo=p3ol/oak)](https://github.com/p3ol/oak/graphs/contributors)

Please check the [CONTRIBUTING.md](https://github.com/p3ol/oak/blob/master/CONTRIBUTING.md) doc for contribution guidelines.


# License

This software is licensed under [MIT](https://github.com/p3ol/oak/blob/master/LICENSE).
