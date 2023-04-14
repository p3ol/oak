import { useEffect, useRef, useState } from 'react';
import { action } from '@storybook/addon-actions';

import Builder from './Builder';
import { baseAddon } from './addons';

export default { title: 'React/Builder' };

const baseContent = [
  { type: 'row', cols: [
    { type: 'col', content: [
      { type: 'title', content: 'This is a title' },
      { type: 'text', content: 'This is a text' },
      { type: 'empty-space', settings: { height: '20px' } },
      { type: 'button', content: 'Click me' },
    ] },
  ] },
  { type: 'image', url: 'https://avatars.githubusercontent.com/u/20414672' },
  { type: 'foldable' },
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

export const withCustomTexts = () => {
  const builderRef = useRef();

  useEffect(() => {
    builderRef.current?.builder.setActiveTextSheet('fr');
  }, []);

  return (
    <div>
      <div>&quot;Paste from clipboard&quot; should be in french</div>
      <Builder
        ref={builderRef}
        addons={[baseAddon(), {
          texts: [{ id: 'fr', texts: {
            core: {
              pasteFromClipboard: 'Coller depuis le presse-papier',
            },
          } }],
        }]}
        value={baseContent}
        rootBoundary={document.documentElement}
        options={{ debug: true }}
        onChange={action('change')}
      />
    </div>
  );
};

export const withMultipleLanguages = () => {
  const builderRef = useRef();
  const [locale, setLocale] = useState('fr');

  const texts = [
    { id: 'fr', texts: {
      core: {
        pasteFromClipboard: 'Coller depuis le presse-papier',
        components: {
          title: {
            name: 'Titre',
          },
        },
      },
    } },
    { id: 'es', texts: {
      core: { pasteFromClipboard: 'Pegar desde el portapapeles' },
    } },
  ];

  return (
    <div>
      <div>
        <button onClick={() => setLocale('en')}>English</button>
        <button onClick={() => setLocale('fr')}>French</button>
        <button onClick={() => setLocale('es')}>Spanish</button>
      </div>
      <div>&quot;Paste from clipboard&quot; should be in {locale}</div>
      <Builder
        addons={[baseAddon(), { texts }]}
        value={baseContent}
        rootBoundary={document.documentElement}
        options={{ debug: true }}
        onChange={action('change')}
        ref={builderRef}
        activeTextSheet={locale}
      />
    </div>
  );
};

export const withMultipleCustomSettings = () => (
  <Builder
    addons={[baseAddon(), {
      settings: [
        { key: 'settings.foo', label: 'Foo', type: 'text', displayable: true },
        { key: 'settings.bar', label: 'Bar', type: 'text' },
      ],
    }]}
    value={baseContent}
    rootBoundary={document.documentElement}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const withMultipleCustomSettingsAndFields = () => (
  <Builder
    addons={[baseAddon(), {
      fields: [{
        type: 'weird-text',
        render: ({ value, onChange }) => (
          <input
            type="text"
            value={value}
            onChange={e => onChange({ value: e.target.value })}
          />
        ),
      }],
      components: [{
        id: 'weird-component',
        name: 'Weird Component',
        group: 'core',
        construct: () => ({ type: 'weird-component', content: '' }),
        render: ({ element }) => <div>{ element.content }</div>,
      }],
      settings: [{
        key: 'settings.foo',
        label: 'Foo',
        type: 'weird-text',
        displayable: true,
        condition: e => e.type === 'weird-component',
      }, {
        key: 'settings.bar',
        label: 'Bar',
        type: 'weird-text',
        condition: e => e.type === 'weird-component',
      }],
    }]}
    value={baseContent}
    rootBoundary={document.documentElement}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const disallowSomeChildren = () => {
  const addon = baseAddon();

  return (
    <div>
      <div>You should not be able to add a text inside a col</div>
      <Builder
        addons={[{
          ...addon,
          components: addon.components.map(c => c.id === 'core' ? {
            ...c,
            components: c.components.map(c_ => c_.id === 'col' ? {
              ...c_,
              disallow: ['text'],
            } : c_),
          } : c),
        }]}
        value={baseContent}
        rootBoundary={document.documentElement}
        options={{ debug: true }}
        onChange={action('change')}
      />
    </div>
  );
};
