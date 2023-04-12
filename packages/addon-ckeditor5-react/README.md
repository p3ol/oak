<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.junipero.design/images/oak-logo-light.svg" />
  <img src="https://cdn.junipero.design/images/oak-logo.svg" height="50" />
</picture>

<br />
<br />

[![GitHub](https://img.shields.io/github/license/p3ol/oak.svg)](https://github.com/p3ol/oak)
[![npm](https://img.shields.io/npm/v/@oakjs/addon-remirror.svg)](https://www.npmjs.com/package/@oakjs/addon-remirror)
[![CI](https://github.com/p3ol/oak/actions/workflows/ci.yml/badge.svg)](https://github.com/p3ol/oak/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/p3ol/oak/branch/master/graph/badge.svg)](https://codecov.io/gh/p3ol/oak)

An addon to use [CKEditor5](https://ckeditor.com) as an oak field for the React renderer.</p>

</div>

# Installation

```sh
yarn add @oakjs/addon-ckeditor5-react @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
```

# Usage

```jsx
import { Builder, baseAddon } from '@oakjs/react';
import { ckeditorFieldAddon } from '@oakjs/addon-ckeditor5';

import '@oakjs/theme/dist/oak.min.css';
import '@oakjs/addon-ckeditor5/dist/oak-addon-ckeditor.min.css';

const myAddon = () => ({
  overrides: [{
    type: 'component',
    targets: ['title', 'text', 'button'],
    fields: [{
      key: 'content',
      type: 'ckeditor',
    }],
  }],
});

export default () => {
  const [content, setContent] = useState([]);

  return (
    <Builder
      addons={[baseAddon(), ckeditorFieldAddon(), myAddon()]}
      value={content}
      onChange={setContent}
    />
  );
};
```

# Documentation

The `ckeditorFieldAddon()` addon adds a new field with the `ckeditor` type.

We can then either directly create component settings with the `ckeditor` field type:

```jsx
import { BuilderField, baseAddon } from '@oakjs/react';
import { ckeditorFieldAddon } from '@oakjs/addon-ckeditor5';

const myAddon = () => ({
  settings: [{
    id: 'my-setting',
    type: 'ckeditor',
    key: 'property.subProperty',
  }],
});

export default () => (
  <BuilderField
    addons={[baseAddon(), ckeditorFieldAddon(), myAddon()]}
    value={content}
    onChange={setContent}
  />
);
```

Or override existing component settings:

```jsx
import { Builder, baseAddon } from '@oakjs/react';
import { ckeditorFieldAddon } from '@oakjs/addon-ckeditor5';

const myAddon = () => ({
  overrides: [{
    type: 'component',
    targets: ['title', 'text', 'button'],
    fields: [{
      key: 'content',
      type: 'ckeditor',
    }],
  }],
});

export default () => (
  <Builder
    addons={[baseAddon(), ckeditorFieldAddon(), myAddon()]}
    value={content}
    onChange={setContent}
  />
);
```

## Contributing

[![](https://contrib.rocks/image?repo=p3ol/oak)](https://github.com/p3ol/oak/graphs/contributors)

Please check the [CONTRIBUTING.md](https://github.com/p3ol/oak/blob/master/CONTRIBUTING.md) doc for contribution guidelines.


## License

This software is licensed under [MIT](https://github.com/p3ol/oak/blob/master/LICENSE).
