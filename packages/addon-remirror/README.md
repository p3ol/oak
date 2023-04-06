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

An addon to use [Remirror]() as an oak field.</p>

</div>

# Installation

```sh
yarn add @oakjs/addon-remirror remirror @remirror/react @remirror/pm
```

# Usage

```jsx
import { Builder, baseAddon } from '@oakjs/react';
import { remirrorFieldAddon } from '@oakjs/addon-remirror';

import '@oakjs/theme/dist/oak.min.css';
import '@oakjs/addon-remirror/dist/oak-addon-remirror.min.css';

const myAddon = () => ({
  overrides: [{
    type: 'component',
    targets: ['title', 'text', 'button'],
    fields: [{
      key: 'content',
      type: 'remirror',
    }],
  }],
});

export default () => {
  const [content, setContent] = useState([]);

  return (
    <Builder
      addons={[baseAddon(), remirrorFieldAddon(), myAddon()]}
      value={content}
      onChange={setContent}
    />
  );
};
```

# Documentation

The `remirrorFieldAddon()` addon adds a new field with the `remirror` type.

We can then either directly create component settings with the `remirror` field type:

```jsx
import { BuilderField, baseAddon } from '@oakjs/react';
import { remirrorFieldAddon } from '@oakjs/addon-remirror';

const myAddon = () => ({
  settings: [{
    id: 'my-setting',
    type: 'remirror',
    key: 'property.subProperty',
  }],
});

export default () => (
  <BuilderField
    addons={[baseAddon(), remirrorFieldAddon(), myAddon()]}
    value={content}
    onChange={setContent}
  />
);
```

Or override existing component settings:

```jsx
import { Builder, baseAddon } from '@oakjs/react';
import { remirrorFieldAddon } from '@oakjs/addon-remirror';

const myAddon = () => ({
  overrides: [{
    type: 'component',
    targets: ['title', 'text', 'button'],
    fields: [{
      key: 'content',
      type: 'remirror',
    }],
  }],
});

export default () => (
  <Builder
    addons={[baseAddon(), remirrorFieldAddon(), myAddon()]}
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
