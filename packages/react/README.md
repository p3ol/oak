<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.junipero.design/images/oak-logo-light.svg" />
  <img src="https://cdn.junipero.design/images/oak-logo.svg" height="50" />
</picture>

<br />
<br />

[![GitHub](https://img.shields.io/github/license/p3ol/oak.svg)](https://github.com/p3ol/oak)
[![npm](https://img.shields.io/npm/v/@oakjs/react.svg)](https://www.npmjs.com/package/@oakjs/react)
[![CI](https://github.com/p3ol/oak/actions/workflows/ci.yml/badge.svg)](https://github.com/p3ol/oak/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/p3ol/oak/branch/master/graph/badge.svg)](https://codecov.io/gh/p3ol/oak)

### @oakjs/react
A React renderer for the (maybe) popular block-based builder

</div>

# Installation

```sh
yarn add @oakjs/react @oakjs/theme
```

# Usage

```jsx
import { useState } from 'react';
import { Builder, baseAddon } from '@oakjs/react';

import '@oakjs/theme/dist/oak.min.css';

export default () => {
  const [content, setContent] = useState([]);

  return (
    <Builder
      addons={[baseAddon()]}
      value={content}
      onChange={setContent}
    />
  );
};
```

# Addons

Oak is by definition an empty shell, composed of addons.
Using addons, you can add components, field definitions, settings, texts sheets, or even override some default settings or props.

In order for you to start using oak with a solid base, we created the `baseAddon()`, which is composed of:

Fields:
- `textField()` -> A simple text field
- `textareaField()` -> A simple textarea
- `selectField()` -> A full-featured select field with deletable items & search
- `colorField()` -> A text field with a color picker
- `imageField()` -> An upload file button with image preview & file name
- `dateField()` -> A date field with a beautiful calendar
- `toggleField()` -> A fancy toogle like on iOS (because we love toggles)

Components:
- `rowComponent()` and `colComponent()` -> An almost complete 12-cols grid layout using flex
- `emptySpaceComponent()` -> A special component to avoid using vertical paddings & margins everywhere
- `titleComponent()` -> A simple component to display h1 to h6 headings
- `textComponent()` -> An even more simple component to display, well, text
- `imageComponent()` -> A component to display images with sizes presets
- `buttonComponent()` -> A button/link component
- `foldableComponent()` -> A component to display collapsed things like 

and Settings:
- `stylingSettings()` -> Allows to set paddings, margins, background image, colors & custom css class to an element
- `responsiveSettings()` -> Allows to show/display an element for various screen sizes

You can either import the addon itself with everything inside:

```jsx
import { Builder, baseAddon } from '@oakjs/react';

export default () => (
  <Builder
    addons={[baseAddon()]}
  />
);
```

Or import everything manually (in case you need to disable something you don't plan to use):

```jsx
import { Builder } from '@oakjs/react';
import * as oakAddons from '@oakjs/react/addons';

export default () => (
  <Builder
    addons={[{
      fields: [
        oakAddons.textField(),
        oakAddons.textareaField(),
        oakAddons.selectField(),
        oakAddons.colorField(),
        oakAddons.imageField(),
        oakAddons.dateField(),
        oakAddons.toggleField(),
      ],
      components: [{
        id: 'core',
        type: 'group',
        name: t => t('core.components.core.title', 'Core components'),
        components: [
          oakAddons.rowComponent(),
          oakAddons.colComponent(),
          oakAddons.emptySpaceComponent(),
          oakAddons.titleComponent(),
          oakAddons.textComponent(),
          oakAddons.imageComponent(),
          oakAddons.buttonComponent(),
          oakAddons.foldableComponent(),
        ],
      }],
      settings: [
        oakAddons.stylingSettings(),
        oakAddons.responsiveSettings(),
      ],
    }]}
  />
);
```

## Custom addons

Creating an addon is as simple as using one:

```jsx
const myAddon = () => ({
  fields: [{
    id: 'my-field',
    name: 'My Field',
    render: ({ value, onChange }) => (
      <input
        type="email"
        value={value}
        onChange={e => onChange({ value: e.target.value })}
      />
    ),
  }]
  components: [{
    id: 'my-component',
    name: 'My Component',
    construct: () => ({ content: 'This is my component' }),
    render: ({ content }) => <div>{ content }</div>,
  }],
});

export default () => (
  <Builder
    addons={[myAddon()]}
  />
);
```

For more information about addons and the various needed props for fields or components, see the [core addons documentation](../core/README.md#addons).

# Documentation

## `<Builder />`

### defaultValue
- Type: `Array<ElementObject|Element>`

Just like an uncontrolled react field, used to provide a default value to the builder.

### value
- Type: `Array<ElementObject|Element>`

Used with `onChange` to provide a controlled value to the builder.

### addons
- Type: `Array<AddonObject>`
- default: `[]`

An array of addons to use with the builder.

### activeTextSheet
- Type: `string`
- default: `null`

The id of the active text sheet.

### rootBoundary
- Type: `string | Element | DocumentFragment`
- default: `'.oak'`

A reference element used by FloatingUI to determine the boundaries of everything that floats (tooltips, menus, ...)

### historyEnabled
- Type: `boolean`
- default: `true`

Whether or not to enable the history (undo/redo) feature.

### topHistoryButtonsContainer
- Type: `string | Element | DocumentFragment`

An element used by `ReactDOM.createPortal` to render the top undo/redo buttons.

### topHistoryButtonsEnabled
- Type: `boolean`
- default: `true`

Whether or not to show the top undo/redo buttons.

### bottomHistoryButtonsContainer
- Type: `string | Element | DocumentFragment`

An element used by `ReactDOM.createPortal` to render the bottom undo/redo buttons.

### bottomHistoryButtonsEnabled
- Type: `boolean`
- default: `true`

Whether or not to show the bottom undo/redo buttons.

### onChange
- Type: `function(value: Array<ElementObject|Element>): void`

A callback function called when the builder value changes.

### onImageUpload
- Type: `function(event: FileEvent): Promise<{ url: string; name: string; [key: string]: any }>`

A callback function called when an image should be uplodaded. It should return a promise that resolves with an object containing the image url, name and any other data you want to store in the image field.

# Contributing

[![](https://contrib.rocks/image?repo=p3ol/oak)](https://github.com/p3ol/oak/graphs/contributors)

Please check the [CONTRIBUTING.md](https://github.com/p3ol/oak/blob/master/CONTRIBUTING.md) doc for contribution guidelines.


# License

This software is licensed under [MIT](https://github.com/p3ol/oak/blob/master/LICENSE).
