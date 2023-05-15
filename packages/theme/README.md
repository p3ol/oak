<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.junipero.design/images/oak-logo-light.svg" />
  <img src="https://cdn.junipero.design/images/oak-logo.svg" height="50" />
</picture>

<br />
<br />

[![GitHub](https://img.shields.io/github/license/p3ol/oak.svg)](https://github.com/p3ol/oak)
[![npm](https://img.shields.io/npm/v/@oakjs/theme.svg)](https://www.npmjs.com/package/@oakjs/theme)
[![CI](https://github.com/p3ol/oak/actions/workflows/ci.yml/badge.svg)](https://github.com/p3ol/oak/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/p3ol/oak/branch/master/graph/badge.svg)](https://codecov.io/gh/p3ol/oak)

### @oakjs/theme
Theme base for Oak

</div>

# Installation

```sh
yarn add @oakjs/theme
```

# Usage

```javascript
import '@oakjs/theme/dist/oak.min.css';
```

If you need to tree-shake some unneeded styles, you can import every component/utility manually instead:

```css
@import "@oakjs/theme/dist/css/reset.min.css";
@import "@oakjs/theme/dist/css/Builder.min.css";
@import "@oakjs/theme/dist/css/Catalogue.min.css";
@import "@oakjs/theme/dist/css/Editable.min.css";
@import "@oakjs/theme/dist/css/Option.min.css";
@import "@oakjs/theme/dist/css/Element.min.css";
@import "@oakjs/theme/dist/css/Row.min.css";
/* ...and so on */
```

The full list is available inside the `dist/css` folder.

# Contributing

[![](https://contrib.rocks/image?repo=p3ol/oak)](https://github.com/p3ol/oak/graphs/contributors)

Please check the [CONTRIBUTING.md](https://github.com/p3ol/oak/blob/master/CONTRIBUTING.md) doc for contribution guidelines.


# License

This software is licensed under [MIT](https://github.com/p3ol/oak/blob/master/LICENSE).
