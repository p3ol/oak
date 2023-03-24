import { useRef, useState } from 'react';
import { action } from '@storybook/addon-actions';

import Builder from './Builder';
import { baseAddon } from './addons';

export default { title: 'React/Builder' };

const baseContent = [
  { type: 'row', cols: [
    { content: [
      { type: 'title', content: 'This is a title' },
      { type: 'text', content: 'This is a text' },
      { type: 'empty-space', settings: { height: '20px' } },
      { type: 'button', content: 'Click me' },
    ] },
  ] },
  { type: 'image', url: 'https://avatars.githubusercontent.com/u/20414672' },
];

export const basic = () => (
  <Builder
    addons={[baseAddon()]}
    value={baseContent}
    rootBoundary={document.documentElement}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const controlled = () => {
  const [value, setValue] = useState(baseContent);

  const addElement = () => {
    setValue(v => [
      ...v,
      { type: 'text', content: 'This is a text added manually' },
    ]);
  };

  return (
    <div>
      <div>
        <button onClick={addElement}>Add element</button>
      </div>
      <Builder
        addons={[baseAddon()]}
        value={value}
        rootBoundary={document.documentElement}
        options={{ debug: true }}
        onChange={setValue}
      />
    </div>
  );
};

export const uncontrolled = () => {
  const builderRef = useRef();

  const addElement = () => {
    builderRef.current?.builder.addElement({
      type: 'text',
      content: 'This is a text added manually',
    });
  };

  return (
    <div>
      <div>
        <button onClick={addElement}>Add element</button>
      </div>
      <Builder
        defaultValue={baseContent}
        addons={[baseAddon()]}
        rootBoundary={document.documentElement}
        options={{ debug: true }}
        onChange={action('change')}
        ref={builderRef}
      />
    </div>
  );
};
