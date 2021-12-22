import { useEffect, useRef, useState } from 'react';
import { mergeDeep, SelectField } from '@poool/junipero';

import { render } from './';
import basicComponents, { localeFr as basicFrench }
  from '../../oak-addon-basic-components/lib';
import richTextField, { localeFr as editorFrench }
  from '../../oak-addon-richtext-field/lib';
import french from './languages/fr';
import proseMirrorEditor from '../../oak-addon-richtext-field-prosemirror/lib';

export default { title: 'oak' };

export const basicConfig = () => {
  const containerRef = useRef();
  const oakRef = useRef();
  const [theme, setTheme] = useState();
  const [currentAddon, setCurrentAddon] = useState({});

  useEffect(() => {
    const ref = render(containerRef.current, {
      debug: true,
      forceRender: true,
      addons: [basicComponents, currentAddon],
      content: [
        {
          type: 'text',
          content: 'This is some fancy text ' +
          '<span style="color:rgb(195, 63, 63);">content</span>',
          settings: {},
          id: '81d6c270-062c-4a89-979e-a58b3c405e38',
        },
      ],
      ...(currentAddon.fieldTypes ? {
        overrides: [{
          type: 'component',
          components: ['text', 'title', 'button'],
          fields: [{
            key: 'content',
            type: 'richtext',
          }],
        }],
      } : {}),
    });

    oakRef.current = ref;

    return () => {
      ref?.destroy();
    };
  }, [currentAddon]);

  const setTexts = field => {
    oakRef.current?.setTexts(field.value);
  };

  return (
    <div>
      { theme === 'blue' && (
        <style type="text/css">
          {`
            .oak {
              --oak-main-color: #2696AF;
              --oak-darker-main-color: #1e8096;
              --oak-lighter-main-color: #27aac7;
              --oak-shadow-color: rgba(38, 150, 175, 0.5);
              --oak-active-color: #0E6176;
              --oak-text-color: #000A24;
            }
          `}
        </style>
      ) }
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SelectField
          style={{ marginBottom: 50 }}
          placeholder="Language"
          options={[
            { title: 'Default (english)', value: {} },
            {
              title: 'French',
              value: mergeDeep(french, basicFrench, editorFrench) },
          ]}
          parseTitle={o => o.title}
          parseValue={o => o.value}
          onChange={setTexts}
        />
        <SelectField
          style={{ marginBottom: 50, marginLeft: 20 }}
          placeholder="Theme"
          options={[
            { title: 'Default', value: 'default' },
            { title: 'Blue', value: 'blue' },
          ]}
          parseTitle={o => o.title}
          parseValue={o => o.value}
          onChange={field => setTheme(field.value)}
        />
        <SelectField
          style={{ marginBottom: 50, marginLeft: 20 }}
          placeholder="Text editor"
          options={[
            { title: 'Default', value: {} },
            { title: 'Slate', value: richTextField },
            { title: 'Prose mirror', value: proseMirrorEditor },
          ]}
          parseTitle={o => o.title}
          parseValue={o => o.value}
          onChange={field => setCurrentAddon(field.value)}
        />
      </div>
      <div ref={containerRef} id="container" />
    </div>
  );
};

export const noHistory = () => {
  const containerRef = useRef();
  const oakRef = useRef();

  useEffect(() => {
    oakRef.current = render(containerRef.current, {
      debug: true,
      addons: [basicComponents],
      historyButtonsEnabled: false,
    });
  }, []);

  return (
    <div ref={containerRef} id="container" />
  );
};

export const noOtherTab = () => {
  const containerRef = useRef();
  const oakRef = useRef();

  useEffect(() => {
    oakRef.current = render(containerRef.current, {
      debug: true,
      addons: [
        basicComponents,
        {
          components: [{
            group: 'other',
            component: {
              ...basicComponents.components[0].component,
              id: 'other-title',
              name: 'Other Title',
            },
          }, {
            id: 'dynamic',
            type: 'group',
            name: 'Dynamic components',
            components: [{
              id: 'dynamic-title',
              name: 'Dynamic title',
              type: 'component',
              construct: () => {},
            }],
          }],
        },
      ],
      otherTabEnabled: false,
    });
  }, []);

  return (
    <div ref={containerRef} id="container" />
  );
};

export const multipleGroups = () => {
  const containerRef = useRef();
  const oakRef = useRef();

  useEffect(() => {
    oakRef.current = render(containerRef.current, {
      debug: true,
      addons: [
        basicComponents,
        {
          components: [{
            group: 'other',
            component: {
              ...basicComponents.components[0].component,
              id: 'other-title',
              name: 'Other Title',
            },
          }, {
            id: 'dynamic',
            type: 'group',
            name: 'Dynamic components',
            components: [],
          }, {
            id: 'various',
            type: 'group',
            name: 'Various components',
            components: [],
          }, {
            id: 'beautiful',
            type: 'group',
            name: 'Beautiful components',
            components: [],
          }],
        },
      ],
      otherTabEnabled: false,
    });
  }, []);

  return (
    <>
      <style>
        {`
          .oak .oak-catalogue .oak-popover {
            width: 800px;
          }

          .oak .oak-catalogue .oak-components .oak-component {
            flex: 0 0 25%;
            width: 25%;
            max-width: 25%;
          }
        `}
      </style>
      <div ref={containerRef} id="container" />
    </>
  );
};
