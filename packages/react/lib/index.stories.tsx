import type {
  AddonObject,
  ComponentSettingsFieldObject,
  ComponentTabOject,
  ElementObject,
} from '@oakjs/core';
import { useEffect, useRef, useState } from 'react';
import { action } from '@storybook/addon-actions';

import Builder, { type BuilderRef } from './Builder';
import { baseAddon } from './addons';

export default { title: 'React/Builder' };

const baseContent: ElementObject[] = [
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
  { type: 'clickable', content: [{ type: 'text', content: 'Click me' }] },
];

export const basic = () => (
  <Builder
    addons={[baseAddon()]}
    value={baseContent}
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
        options={{ debug: true }}
        onChange={setValue}
      />
    </div>
  );
};

export const uncontrolled = () => {
  const builderRef = useRef<BuilderRef>();

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
        options={{ debug: true }}
        onChange={action('change')}
        ref={builderRef}
      />
    </div>
  );
};

export const withCustomTexts = () => {
  const builderRef = useRef<BuilderRef>();

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
        } as AddonObject]}
        value={baseContent}
        rootBoundary={document.documentElement}
        options={{ debug: true }}
        onChange={action('change')}
      />
    </div>
  );
};

export const withMultipleLanguages = () => {
  const builderRef = useRef<BuilderRef>();
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
        addons={[baseAddon(), { texts } as AddonObject]}
        value={baseContent}
        options={{ debug: true }}
        onChange={action('change')}
        ref={builderRef}
        activeTextSheet={locale}
      />
    </div>
  );
};

export const withMultipleCustomSettings = () => {
  const [addons, setAddons] = useState(true);

  return (
    <>
      <button onClick={() => setAddons(a => !a)}>Toggle addons</button>
      <Builder
        addons={addons ? [baseAddon(), {
          settings: [
            { id: 'foo', key: 'settings.foo', label: 'Foo', type: 'text',
              displayable: true },
            { id: 'bar', key: 'settings.bar', label: 'Bar', type: 'text' },
          ],
          overrides: [{
            id: 'titleOverride',
            type: 'component',
            targets: ['title'],
            fields: [{
              key: 'headingLevel',
              options: ['t1', 't2', 't3', 't4', 't5', 't6'],
              priority: 3,
            }, {
              key: 'settings.foo',
              priority: 1,
            }, {
              key: 'settings.bar',
              priority: 2,
            }],
          }, {
            id: 'classNameOverride',
            type: 'setting',
            targets: ['*'],
            key: 'settings.className',
            placeholder: 'This is a global setting placeholder',
          }],
        } as AddonObject] : []}
        value={baseContent}
        options={{ debug: true }}
        onChange={action('change')}
      />
    </>
  );
};

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
        condition: (e: ElementObject) => e.type === 'weird-component',
      }, {
        key: 'settings.bar',
        label: 'Bar',
        type: 'weird-text',
        condition: (e: ElementObject) => e.type === 'weird-component',
      }] as ComponentSettingsFieldObject[],
    } as AddonObject]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const withComponentOverride = () => (
  <Builder
    addons={[baseAddon(), {
      overrides: [{
        id: 'buttonOverride',
        type: 'component',
        targets: ['button'],
        fields: [{
          key: 'action',
          type: 'select',
          options: [
            { value: 'link', title: 'Open a link' },
            { value: 'third-party', title: 'Open a third-party service' },
          ],
        }, {
          key: 'thirdPartyService',
          type: 'text',
          label: 'Third party service ID',
          priority: 2,
          displayable: true,
          condition: (element: ElementObject) =>
            element.action === 'third-party',
        }],
      }],
    } as AddonObject]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const disallowSomeChildren = () => (
  <div>
    <div>You should not be able to add a text inside a col</div>
    <Builder
      addons={[baseAddon(), {
        overrides: [{
          type: 'component',
          targets: ['col'],
          disallow: ['text'],
        }],
      } as AddonObject]}
      value={baseContent}
      options={{ debug: true }}
      onChange={action('change')}
    />
  </div>
);

export const withMergeOverrides = () => (
  <Builder
    addons={[baseAddon(), {
      overrides: [{
        id: 'titleOverride',
        type: 'component',
        targets: ['title'],
        fields: [{
          key: 'headingLevel',
          options: ['t1', 't2', 't3', 't4', 't5', 't6'],
          priority: 3,
        }],
      }, {
        id: 'constructOverride',
        type: 'component',
        targets: ['title'],
        construct: () => ({
          type: 'title',
          headingLevel: 't4',
          content: 'This is an updated title',
        }),
      }],
    } as AddonObject]}
    value={baseContent}
    options={{ debug: true, overrideStrategy: 'merge' }}
    onChange={action('change')}
  />
);

export const withNonEditableComponents = () => (
  <Builder
    addons={[baseAddon(), {
      overrides: [{
        type: 'component',
        targets: ['*'],
        editable: false,
      }],
    }]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const withModalEditable = () => (
  <Builder
    addons={[baseAddon()]}
    value={baseContent}
    onChange={action('change')}
    editableType="modal"
    options={{ debug: true }}
  />
);

export const withSettingOverrides = () => (
  <Builder
    addons={[baseAddon(), {
      overrides: [{
        type: 'setting',
        targets: ['*'],
        key: 'responsive.xl',
        info: 'Test',
      }, {
        type: 'setting',
        key: 'styles.borderWidth',
        targets: ['*'],
        fields: [],
        fieldType: 'text',
      }, {
        type: 'setting',
        key: 'styles.borderColor',
        targets: ['*'],
        fields: [],
        fieldType: 'color',
        condition: (element: ElementObject) =>
          element?.styles?.borderWidth,
      }],
    }]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const withDisallowedComponents = () => (
  <Builder
    addons={[baseAddon(), {
      overrides: [{
        type: 'component',
        targets: ['foldable', 'clickable'],
        disallow: ['text'],
      }],
    }]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const withDisabledSettings = () => (
  <Builder
    addons={[baseAddon(), {
      overrides: [{
        type: 'setting',
        key: 'styles.borderWidth',
        targets: ['*'],
        condition: () => false,
      }],
    }]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const withMultipleCatalogueTabs = () => (
  <Builder
    addons={[baseAddon(), {
      components: [{
        type: 'group',
        id: 'tab-1',
        name: 'Tab 1',
        components: [{
          type: 'component',
          group: 'tab-1',
          id: 'tab-1-title',
          name: 'Tab 1 Title',
          construct: () => ({ type: 'tab-1-title', content: 'Tab 1 Title' }),
        }],
      }, {
        type: 'group',
        id: 'tab-2',
        name: 'Tab 2',
        components: [{
          type: 'component',
          group: 'tab-2',
          id: 'tab-2-title',
          name: 'Tab 2 Title',
          construct: () => ({ type: 'tab-2-title', content: 'Tab 2 Title' }),
        }],
      }, {
        type: 'group',
        id: 'tab-3',
        name: 'Tab 3',
        components: [{
          type: 'component',
          group: 'tab-3',
          id: 'tab-3-title',
          name: 'Tab 3 Title',
          construct: () => ({ type: 'tab-3-title', content: 'Tab 3 Title' }),
        }],
      }, {
        type: 'group',
        id: 'tab-4',
        name: 'Tab 4',
        components: [{
          type: 'component',
          group: 'tab-4',
          id: 'tab-4-title',
          name: 'Tab 4 Title',
          construct: () => ({ type: 'tab-4-title', content: 'Tab 4 Title' }),
        }],
      }],
    } as AddonObject]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const withMultipleEditableTabs = () => (
  <Builder
    addons={[baseAddon(), {
      settings: [{
        type: 'tab',
        id: 'tab-1',
        title: 'Tab 1',
      }, {
        type: 'tab',
        id: 'tab-2',
        title: 'Tab 2',
      }, {
        type: 'tab',
        id: 'tab-3',
        title: 'Tab 3',
      }, {
        type: 'tab',
        id: 'tab-4',
        title: 'Tab 4',
      }, {
        type: 'tab',
        id: 'tab-5',
        title: 'Tab 5',
      }, {
        type: 'tab',
        id: 'tab-6',
        title: 'Tab 6',
      }, {
        type: 'tab',
        id: 'tab-7',
        title: 'Tab 7',
      }, {
        type: 'tab',
        id: 'tab-8',
        title: 'Tab 8',
      }, {
        type: 'tab',
        id: 'tab-9',
        title: 'Tab 9',
      }, {
        type: 'tab',
        id: 'tab-10',
        title: 'Tab 10',
      }],
    } as AddonObject]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);
