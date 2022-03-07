<div align="center">

<h1>🌳 oak</h1>

[![GitHub](https://img.shields.io/github/license/p3ol/oak.svg)](https://github.com/p3ol/oak)
[![npm](https://img.shields.io/npm/v/@poool/oak-addon-basic-components.svg)](https://www.npmjs.com/package/@poool/oak-addon-basic-components)
[![CI](https://github.com/p3ol/oak/actions/workflows/ci.yml/badge.svg)](https://github.com/p3ol/oak/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/p3ol/oak/branch/master/graph/badge.svg)](https://codecov.io/gh/p3ol/oak)

<br />
<h3>oak-addon-basic-components</h3>
<p>A collection of basic components to be used with the infamous page builder</p>

</div>

## Content

New components:
- `Title`: Allows to add pre-made hx headers (h1, h2, ...) to your content
- `Text`: Basic text node managed with a textarea field
- `Image`: Basic image component uploaded using `image` field type
- `Button`: Basic HTML button/link component

New field types:
- `image`: Allows to upload an image and use it inside an element (uses oak's `onImageUpload` event)


## Installation

```bash
yarn add @poool/oak @poool/oak-addon-basic-components
```

## Usage

```javascript
import { render } from '@poool/oak';
import basicComponents from '@poool/oak-addon-basic-components';

render(document.getElementById('app'), {
  addons: [basicComponents],
  /* ... */
});
```

Don't forget to import styles, for example using `style-loader` and `webpack`:

```javascript
import '@poool/oak-addon-basic-components/dist/oak-addon-basic-components.min.css';
```

Or import them directly inside your own styles using `less`, `sass` or `stylus`:

```css
@import "@poool/oak-addon-basic-components/dist/oak-addon-basic-components.min.css";
```

## Translations

Available languages:
- English (default)
- French

To import translations and replace text with translations, use the `texts` setting:

```js
import { render, localeFr } from '@poool/oak';
import basicComponents, { localeFr as basicLocaleFr } from '@poool/oak-addon-basic-components';
import { mergeDeep } from '@poool/junipero-utils';

render(document.getElementById('app'), {
  addons: [basicComponents],
  texts: mergeDeep({}, localeFr, basicLocaleFr),
  /* ... */
});
```

## Contributing

[![](https://contrib.rocks/image?repo=p3ol/oak)](https://github.com/p3ol/oak/graphs/contributors)

Please check the [CONTRIBUTING.md](https://github.com/p3ol/oak/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/oak/blob/master/LICENSE).

