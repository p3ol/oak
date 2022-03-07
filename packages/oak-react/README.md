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

## Documentation

### `<Builder />`

#### Props

- `value` {`Array`} the content you want your Builder to begin with. If you want to start with a empty Builder, pass an empty array.
- `options`{`Object`} (optional) the options you want to pass to the Builder. See [options](https://github.com/p3ol/oak/tree/master/packages/oak#options) for more information.
- `onChange` {`Function`} (optional) the event listener which will be called when the Builder changes. See [onChange event](https://github.com/p3ol/oak/tree/master/packages/oak#onchange) for more information.
- `onImageUpload` {`Function`} (optional) the event listener which will be called when an image is uploaded using the `image` field type. See [onImageUpload event](https://github.com/p3ol/oak/tree/master/packages/oak#onimageupload)
- `containerProps` {`Object`} (optional) the props you want to pass to the Builder's inner container.


## Contributing

![https://github.com/p3ol/oak/graphs/contributors](https://contrib.rocks/image?repo=p3ol/oak)

Please check the [CONTRIBUTING.md](https://github.com/p3ol/oak/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## License

This software is licensed under [MIT](https://github.com/p3ol/oak/blob/master/LICENSE).
