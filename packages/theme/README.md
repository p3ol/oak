![junipero](https://storage.googleapis.com/junipero-cdn/images/logo-github.png)

<div align="center">

[![npm](https://img.shields.io/npm/v/@junipero/react.svg)](https://www.npmjs.com/package/@junipero/react)

<br />
<p>Simple and beautiful React components for the web</p>

</div>

## Installation

```bash
yarn add @junipero/react
```

## Usage

```javascript
import { TextField } from '@junipero/react';

export default () => (
  <TextField />
);
```

Don't forget to import styles, for example using `style-loader` and `webpack`:

```javascript
import '@junipero/react/dist/junipero-react.min.css';
```

Or import them directly inside your own styles using `less`, `sass` or `stylus`:

```css
@import "~@junipero/react/dist/junipero-react.min.css";
```

#### Dependencies

These libraries are not bundled with Junipero and required at runtime:
- [react](https://www.npmjs.com/package/react)
- [react-dom](https://www.npmjs.com/package/react-dom)
- [react-popper](https://www.npmjs.com/package/react-popper)
- [@popperjs/core](https://www.npmjs.com/package/@popperjs/core)

## [Documentation](https://junipero.design)

https://junipero.design

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/junipero/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/junipero/blob/master/LICENSE).
