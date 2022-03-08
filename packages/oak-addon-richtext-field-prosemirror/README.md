<div align="center">

<h1>🌳 oak</h1>

[![GitHub](https://img.shields.io/github/license/p3ol/oak.svg)](https://github.com/p3ol/oak)
[![npm](https://img.shields.io/npm/v/@poool/oak-addon-richtext-field-prosemirror.svg)](https://www.npmjs.com/package/@poool/oak-addon-richtext-field-prosemirror)
[![CI](https://github.com/p3ol/oak/actions/workflows/ci.yml/badge.svg)](https://github.com/p3ol/oak/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/p3ol/oak/branch/master/graph/badge.svg)](https://codecov.io/gh/p3ol/oak)

<br />
<h3>oak-addon-richtext-field-prosemirror</h3>
<p>A semi-complete WYSIWYG rich text editor field using <a href="https://github.com/ProseMirror/prosemirror">ProseMirror</a>, twin brother and exact opposite of <a href="https://github.com/p3ol/oak/blob/master/packages/oak-addon-richtext-field">oak-addon-richtext-field</a></p>

</div>

## Content

New field type:
- `richtext`: Allows to use rich text editing capabilities (bold, italic, font size, color, ...)


## Installation

```bash
yarn add @poool/oak @poool/oak-addon-richtext-field-prosemirror
```

## Usage

```javascript
import { render } from '@poool/oak';
import richTextField from '@poool/oak-addon-richtext-field-prosemirror';

render(document.getElementById('app'), {
  addons: [richTextField],
  overrides: [{
    type: 'component',
    components: ['title', 'text', 'button', /* ... */],
    fields: [{
      key: 'content',
      type: 'richtext',
    }],
  }]
  /* ... */
});
```

Don't forget to import styles, for example using `style-loader` and `webpack`:

```javascript
import '@poool/oak-addon-richtext-field-prosemirror/dist/oak-addon-richtext-field-prosemirror.min.css';
```

Or import them directly inside your own styles using `less`, `sass` or `stylus`:

```css
@import "@poool/oak-addon-richtext-field-prosemirror/dist/oak-addon-richtext-field-prosemirror.min.css";
```

## Translations

Available languages:
- English (default)
- French

To import translations and replace text with translations, use the `texts` setting:

```js
import { render, localeFr } from '@poool/oak';
import richTextField, { localeFr as richTextLocaleFr } from '@poool/oak-addon-richtext-field-prosemirror';
import { mergeDeep } from '@poool/junipero-utils';

render(document.getElementById('app'), {
  addons: [richTextField],
  texts: mergeDeep({}, localeFr, richTextLocaleFr),
  /* ... */
});
```

## Contributing

[![](https://contrib.rocks/image?repo=p3ol/oak)](https://github.com/p3ol/oak/graphs/contributors)

Please check the [CONTRIBUTING.md](https://github.com/p3ol/oak/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/oak/blob/master/LICENSE).

