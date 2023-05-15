<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.junipero.design/images/oak-logo-light.svg" />
  <img src="https://cdn.junipero.design/images/oak-logo.svg" height="50" />
</picture>

<br />
<br />

[![GitHub](https://img.shields.io/github/license/p3ol/oak.svg)](https://github.com/p3ol/oak)
[![npm](https://img.shields.io/npm/v/@oakjs/strapi-plugin.svg)](https://www.npmjs.com/package/@oakjs/strapi-plugin)
[![CI](https://github.com/p3ol/oak/actions/workflows/ci.yml/badge.svg)](https://github.com/p3ol/oak/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/p3ol/oak/branch/master/graph/badge.svg)](https://codecov.io/gh/p3ol/oak)

### @oakjs/strapi-plugin
An [Strapi](https://strapi.io) plugin to add Oak as a custom field

</div>

# Installation

```sh
yarn add @oakjs/strapi-plugin
```

# Usage

Strapi automatically detects the plugin and adds it to the list of available fields. You have nothing special to do.

# Customization

If you need to extend Oak's behavior, you need to create a new admin extension and use the `oak:addons:add` hook to add your custom addons inside strapi's `src/admin/app.js`:

```js
export default {
  bootstrap (app) {
    app.registerHook('oak:addons:add', () => ({
      fields: {},
      components: {},
      settings: {},
    }));
  },
}
```

ℹ️ Remember to rebuild the whole admin after each change, using `strapi build`.

# Contributing

[![](https://contrib.rocks/image?repo=p3ol/oak)](https://github.com/p3ol/oak/graphs/contributors)

Please check the [CONTRIBUTING.md](https://github.com/p3ol/oak/blob/master/CONTRIBUTING.md) doc for contribution guidelines.


# License

This software is licensed under [MIT](https://github.com/p3ol/oak/blob/master/LICENSE).
