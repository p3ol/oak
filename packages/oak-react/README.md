<div align="center">

<h1>🌳 oak</h1>

[![GitHub](https://img.shields.io/github/license/p3ol/oak.svg)](https://github.com/p3ol/oak)
[![npm](https://img.shields.io/npm/v/@poool/oak-react.svg)](https://www.npmjs.com/package/@poool/oak-react)
[![CI](https://github.com/p3ol/oak/actions/workflows/ci.yml/badge.svg)](https://github.com/p3ol/oak/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/p3ol/oak/branch/master/graph/badge.svg)](https://codecov.io/gh/p3ol/oak)

<br />
<h3>oak-react</h3>
<p>A simple wrapper to use Oak inside React</p>

</div>

## Installation

```bash
yarn add @poool/oak @poool/oak-react
```

## Usage

With this React SDK you can add the Oak renderer easily in your projects, simply using our Builder component.

```jsx
import { useState } from 'react';
import { Builder } from '@poool/oak-react';

export default () => {
  const [value, setValue] = useState([]);

  const onChange = field => {
    setValue(field.value);
  };

  return (
    <Builder
      onChange={onChange}
      value={value}
    />
  );
};
```

This will simply render a new Oak builder, with an empty content inside and with a `onChange` event listener which simply logs the new value of the Oak builder. This seems to be the most basic usage of the Oak SDK.

Note that you are mandatory to pass an array as the value of the builder. Pass an empty array if you want to start with an empty builder.

## Documentation

### `<Builder />`

#### Props

- `value` {`Array`} the content you want our Builder to begin with. If you want to start with a empty Builder, pass an empty array.
- `options`{`Object`} (optional) the options you want to pass to the Builder. See [options](https://github.com/p3ol/oak/tree/chore/docs/packages/oak#options) for more information.
- `onChange` {`Function`} (optional) the event listener which will be called when the Builder changes. See [onChange event](https://github.com/p3ol/oak/tree/chore/docs/packages/oak#onchange) for more information.
- `onImageUpload` {`Function`} (optional) the event listener which will be called when an image is uploaded using the `image` field type. See [onImageUpload event](https://github.com/p3ol/oak/tree/chore/docs/packages/oak#onimageupload)
- `className` {`string`} (optional) the class name you want to add to the Builder.
- `ref` {`React.ref`} (optional) the ref you want to pass to the Builder.
- `containerProps` {`Object`} (optional) the props you want to pass to the Builder's container.


## Contributing

![https://github.com/p3ol/oak/graphs/contributors](https://contrib.rocks/image?repo=p3ol/oak)

Please check the [CONTRIBUTING.md](https://github.com/p3ol/oak/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/oak/blob/master/LICENSE).
