<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.junipero.design/images/oak-logo-light.svg" />
  <img src="https://cdn.junipero.design/images/oak-logo.svg" height="50" />
</picture>

<br />
<br />

[![GitHub](https://img.shields.io/github/license/p3ol/oak.svg)](https://github.com/p3ol/oak)
[![npm](https://img.shields.io/npm/v/@oakjs/addon-lexical.svg)](https://www.npmjs.com/package/@oakjs/addon-lexical)
[![CI](https://github.com/p3ol/oak/actions/workflows/ci.yml/badge.svg)](https://github.com/p3ol/oak/actions/workflows/ci.yml)

### @oakjs/addon-lexical
An addon to use [Lexical](https://lexical.dev) as an oak rich text field

</div>

# Installation

```sh
yarn add @oakjs/addon-lexical lexical @lexical/react @lexical/html \
  @lexical/link @lexical/list @lexical/rich-text @lexical/selection \
  @lexical/table @lexical/utils
```

# Usage

The field works with both builders (`@oakjs/ash` & `@oakjs/react`): it only
relies on the options given to fields by the builder (`fieldOptions.t` for
translations, `fieldOptions.floatingsRef` to render its menus). Inside ash, it
follows the builder's colors (light & dark).

```jsx
import { Builder, baseAddon } from '@oakjs/ash';
import { lexicalFieldAddon } from '@oakjs/addon-lexical';

import '@oakjs/ash/styles.css';
import '@oakjs/addon-lexical/dist/oak-addon-lexical.min.css';

const richTextAddon = {
  overrides: [{
    type: 'component',
    targets: ['title', 'text', 'button'],
    fields: [{ key: 'content', type: 'lexical' }],
  }],
};

// Addons must be stable: define them once
const addons = [baseAddon(), lexicalFieldAddon(), richTextAddon];

export default () => (
  <div style={{ height: '100vh' }}>
    <Builder addons={addons} value={content} onChange={setContent} />
  </div>
);
```

With `@oakjs/react`, import `Builder` & `baseAddon` from `@oakjs/react` (and
`@oakjs/theme`'s stylesheet) instead.

# Editing

The default toolbar has the same items as `@oakjs/addon-ckeditor5-react`'s:

| Item | Description |
| --- | --- |
| `undo`, `redo` | History |
| `bold`, `italic`, `strikethrough`, `underline` | Text formats |
| `link` | Link, optionally opened in a new tab |
| `fontColor` | Junipero's color field (picker & hex/rgb input), or remove the color |
| `fontSize` | Tiny, small, default, big & huge (CKEditor's sizes) |
| `bulletedList`, `numberedList` | Lists (nested with `indent`) |
| `removeFormat` | Removes formats, colors & sizes from the selection |
| `outdent`, `indent` | Indentation |
| `alignment` | Left, center, right, justify |
| `horizontalLine` | Horizontal rule |
| `blockQuote` | Quote |
| `insertTable` | Table, sized by selecting cells (up to 6 × 6), then rows & columns insertion/deletion |
| `heading` | Paragraph & headings (not in the default toolbar) |
| `\|` | Separator |

Customize it with the addon's options:

```js
lexicalFieldAddon({
  toolbar: ['bold', 'italic', 'link', '|', 'heading', 'bulletedList'],
  fontSizes: [
    { label: 'Default', value: null },
    { label: 'Large', value: '24px' },
  ],
});
```

`DEFAULT_TOOLBAR` & `DEFAULT_FONT_SIZES` are exported to
extend the defaults.

# Output

The field's value is an html string, made of tags & inline styles only (the
editor's classes are removed), so that it renders the same on your website
without any stylesheet:

```html
<p style="text-align: center;">
  Subscribe to <strong>The Daily Oak</strong>,
  <span style="color: hsl(0, 75%, 60%); font-size: 1.4em;">today</span>
</p>
```

Selecting an element doesn't change its content: Lexical's formatting of the
html is only emitted once the content is edited. Inline values (e.g. a
button's plain text) are wrapped in a paragraph once edited.

# Collaboration

With `@oakjs/ash`'s collaboration (e.g. `@oakjs/ash/yjs`), the field:

- applies changes made by other users while you type, without moving your
  caret (it moves along with the text changed before it);
- shares your cursor, and displays the other users' carets & selections.

Lexical's undo history is made of snapshots of the whole document, so it is
cleared when another user changes the field (the builder's own undo/redo
still works).
