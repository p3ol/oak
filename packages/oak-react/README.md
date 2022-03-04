# Poool oak - React SDK

> The easiest way to use Oak in your React project.

## Installation

```bash
yarn add @poool/oak-react
```

## Usage

With this React SDK you can add the Oak renderer easily in your projects, simply using our Builder component.

```jsx
import React from 'react';

import { Builder } from '@poool/oak-react'
export default () => {
  const onChange = (field) => {
    console.log(field.value);
  }

  return (
    <Builder
      onChange={onChange}
      value={[]}
    />
  );
}
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








