<div align="center">

<h1>🌳 oak</h1>

[![npm](https://img.shields.io/npm/v/@poool/oak.svg)](https://www.npmjs.com/package/@poool/oak)

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

Defines a list of components/fields to override. See [overrides](#overrides) for more information.

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
  }]
});
```

If you need to have a look at more complex examples, feel free to take a look at all the addons we have already created in the `packages` folder.

### Events

#### onChange
- Arguments: `({ value: Array }: Object)`

Example:
```js
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

// TODO

### Settings

// TODO

### Texts

// TODO

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/blob/master/LICENSE).
