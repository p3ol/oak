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

render(document.getElementById('app'));
```

Don't forget to import styles, for example using `style-loader` and `webpack`:

```javascript
import '@poool/oak/dist/oak.min.css';
```

Or import them directly inside your own styles using `less`, `sass` or `stylus`:

```css
@import "@poool/oak/dist/oak.min.css";
```

#### Dependencies

Oak is bundled with all its internal dependencies, but you can also use it without them:

```javascript
// ESM version
import { render } from '@poool/oak/dist/standalone/esm';

// Require version
const { render } = require('@poool/oak/dist/standalone/oak.cjs.js');
```

Don't forget to install these dependencies as they will be required at runtime:
- [react](https://www.npmjs.com/package/react)
- [react-dom](https://www.npmjs.com/package/react-dom)
- [react-popper](https://www.npmjs.com/package/react-popper)
- [@popperjs/core](https://www.npmjs.com/package/@popperjs/core)

## [Documentation](https://oak.design)

https://oak.design

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/blob/master/LICENSE).
