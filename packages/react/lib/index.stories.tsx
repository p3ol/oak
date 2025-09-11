import {
  stylingSettingsFields,
  type AddonObject,
  type ComponentSettingsFieldObject,
  type ElementObject,
} from '@oakjs/core';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { action } from 'storybook/actions';
import { Button } from '@junipero/react';

import Builder, { type BuilderRef } from './Builder';
import { baseAddon } from './addons';
import { ImageField } from './fields';

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

export const Basic = () => (
  <Builder
    addons={[baseAddon()]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const Controlled = () => {
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

export const Uncontrolled = () => {
  const builderRef = useRef<BuilderRef>(null);

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

export const WithCustomDefaults = () => (
  <Builder
    addons={[baseAddon(), {
      overrides: [{
        type: 'setting',
        targets: ['*'],
        key: 'settings.dir',
        default: (_, { builder }) => builder.options.defaults?.dir || 'ltr',
      }],
    }]}
    value={baseContent}
    options={{ debug: true, defaults: { dir: 'rtl' } }}
    onChange={action('change')}
  />
);

export const WithCustomTexts = () => {
  const builderRef = useRef<BuilderRef>(null);

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

export const WithMultipleLanguages = () => {
  const builderRef = useRef<BuilderRef>(null);
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

export const WithMultipleCustomSettings = () => {
  const [addons, setAddons] = useState(true);

  return (
    <>
      <button onClick={() => setAddons(a => !a)}>Toggle addons</button>
      <Builder
        addons={addons ? [baseAddon(), {
          settings: [
            { id: 'foo', key: 'settings.foo', label: 'Foo', type: 'text',
              displayable: true },
            { id: 'bar', key: 'settings.bar', label: 'Bar', type: 'tags' },
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

export const WithMultipleCustomSettingsAndFields = () => (
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

export const WithComponentOverride = () => (
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

export const DisallowSomeChildren = () => (
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

export const WithMergeOverrides = () => (
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

export const WithNonEditableComponents = () => (
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

export const WithModalEditable = () => (
  <Builder
    addons={[baseAddon()]}
    value={baseContent}
    onChange={action('change')}
    editableType="modal"
    options={{ debug: true }}
  />
);

export const WithSettingOverrides = () => (
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

export const WithMergeMultipleLevelsOverrides = () => (
  <Builder
    addons={[baseAddon(), {
      overrides: [
        {
          type: 'component',
          targets: ['image'],
          fields: [{
            type: 'image',
            key: ['url', 'name'],
            props: {
              accept: [
                'image/jpeg', 'image/jpg',
              ],
            },
          }],
        },
        {
          type: 'field',
          targets: ['image'],
          render: ImageField,
          props: {
            yoo: 'yoo',
            accept: [
              'image/jpeg', 'image/jpg', 'image/png',
            ],
          },
        },
        {
          type: 'setting',
          key: 'styles.backgroundImage',
          targets: ['*'],
          fields: [],
          fieldType: 'image',
          props: {
            iconOnly: true,
            className: 'oak-mr-4 oak-relative oak-top-[2px]',
            accept: [
              'image/jpeg', 'image/jpg', 'image/png',
              'image/svg+xml', 'image/gif',
            ],
          },
        }],
    }]}
    value={baseContent}
    options={{ debug: true, overrideStrategy: 'merge' }}
    onChange={action('change')}
  />
);

export const WithDisallowedComponents = () => (
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

export const WithDisabledSettings = () => (
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

export const WithMultipleCatalogueTabs = () => (
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

export const WithMultipleEditableTabs = () => (
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

export const WithDisableTabs = () => (
  <Builder
    addons={[baseAddon(), {
      overrides: [{
        type: 'setting',
        targets: ['*'],
        key: 'responsive',
        condition: () => false,
      }],
    } as AddonObject]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const WithImageUpdload = () => (
  <Builder
    onImageUpload={(e: FormEvent) => {
      action('upload')(e);

      return {
        name: 'capture.png',
        // eslint-disable-next-line @stylistic/js/max-len
        url: 'https://storage.googleapis.com/poool-dev-cdn/uploads/57f3c14d0b26241cde521669/original/Capture%20d%E2%80%99e%CC%81cran%202023-03-16%20a%CC%80%2010.32.11.png',
      };
    }}
    addons={[baseAddon()]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const WithNonDuplicableOrCopyableComponents = () => (
  <Builder
    addons={[baseAddon(), {
      overrides: [{
        type: 'component',
        targets: ['title'],
        editable: false,
        usable: false,
        duplicable: false,
        copyable: false,
        draggable: false,
      }],
    }]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const WithSharedSettings = () => (
  <Builder
    addons={[baseAddon(), {
      settings: [{
        key: 'settings.flexWrap',
        label: 'Flex wrap',
        type: 'select',
        options: [
          { title: 'No wrap', value: 'nowrap' },
          { title: 'Wrap', value: 'wrap' },
          { title: 'Wrap Reverse', value: 'wrap-reverse' },
        ],
        props: {
          clearable: true,
          searchable: false,
        },
        condition: (element: ElementObject) => element.type === 'row',
        default: 'nowrap',
      }],
    }, {
      overrides: [{
        type: 'setting',
        targets: ['row', 'foldable'],
        key: 'settings.flexWrap',
        condition: (element: ElementObject) =>
          ['row', 'foldable'].includes(element.type),
      }],
    }]}
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const WithFunctionAsDefault = () => {
  return (
    <div>
      <Builder
        addons={[baseAddon(), {
          settings: [{
            key: 'settings.foo',
            label: 'Foo',
            type: 'select',
            options: [
              { title: 'One', value: 1 },
              { title: 'Two', value: 2 },
            ],
            default: (element: ElementObject) => {

              return element.type === 'row' ? 1 : 2;
            },
            condition: () => {

              return true;
            },
          } as ComponentSettingsFieldObject],
        }]}
        options={{ debug: true }}
      />
    </div>
  );
};

export const WithCustomFieldDisplayfunction = () => {
  return (
    <div>
      <Builder
        addons={[baseAddon(), {
          settings: [{
            key: 'settings.foo',
            label: 'Foo',
            type: 'date',
            default: () => new Date(),
            displayable: true,
            display: (value: any) => (value as Date).toISOString(),
            condition: () => true,
          } as ComponentSettingsFieldObject],
        }]}
        options={{ debug: true }}
      />
    </div>
  );
};

export const WithExtendedSettings = () => (
  <Builder
    addons={[
      baseAddon(),
      {
        settings: stylingSettingsFields('styles.checked'),
      },
    ]

    }
    value={baseContent}
    options={{ debug: true }}
    onChange={action('change')}
  />
);

export const WithCatalogueUpdate = () => {
  const [addons, setAddons] = useState([]);

  const updateAddons = () => {
    if (addons.length) {
      setAddons([]);
    } else {
      setAddons([baseAddon()]);
    }
  };

  return (
    <>
      <Button onClick={updateAddons}>
        Update Addons
      </Button>
      <Builder
        addons={addons}
        value={baseContent}
        options={{ debug: true }}
        onChange={action('change')}
      />
    </>
  );
};

export const WithRemovingField = () => {
  return (
    <div>
      <Builder
        editableType="modal"
        value={[{
          type: 'clickable',
          action: 'link',
          url: '',
          content: [],
          id: 'eb1c798b-1dc7-4968-95d9-e4faf0e38bd6',
        }]}
        addons={[baseAddon(), {
          overrides: [{
            type: 'component',
            targets: ['button', 'clickable'],
            fields: [{
              key: 'url',
              type: null,
              condition: () => true,
            }, {
              key: 'target',
              type: null,
              condition: () => false,
            }],
          }],
        }]}
        options={{ debug: true }}
      />
    </div>
  );
};
