import { useEffect, useRef } from 'react';
import { SelectField } from '@poool/junipero';

import { render } from './';
import basicComponents, { localeFr as basicFrench }
  from '../../oak-addon-basic-components/lib';
import french from './languages/fr';

export default { title: 'oak' };

export const basicConfig = () => {
  const containerRef = useRef();
  const oakRef = useRef();

  useEffect(() => {
    oakRef.current = render(containerRef.current, {
      debug: true,
      addons: [basicComponents],
      content: [
        {
          type: 'row',
          settings: {
            alignItems: 'flex-start',
          },
          cols: [
            {
              type: 'col',
              content: [
                {
                  type: 'title',
                  content: 'Abonne toi morray',
                  headingLevel: 'h1',
                  settings: {},
                  id: 'b5f3ac44-d376-44e6-802a-607f7ffcf494',
                },
              ],
              id: '98247547-4b39-41fd-aab9-566ff7eca833',
              styles: {},
            },
          ],
          id: '0cdbefca-4f3c-4f82-be58-a0a5a59a4088',
        },
        {
          type: 'row',
          settings: {
            alignItems: 'flex-start',
          },
          cols: [
            {
              type: 'col',
              content: [
                {
                  type: 'title',
                  content: 'Advantage 1',
                  headingLevel: 'h3',
                  settings: {},
                  id: '926575cb-4630-4379-b0f1-0adabf9d9950',
                },
                {
                  type: 'text',
                  content: 'I want this word <span style="font-weight: bold;"' +
                    '>bold</span><br />and this on a new line',
                  settings: {},
                  id: '7b617499-e8db-4e8a-a7fd-f687df67c216',
                },
              ],
              id: '31db9fa0-6786-4e49-af97-5675ebc0b9be',
              styles: {},
            },
            {
              content: [
                {
                  type: 'title',
                  content: 'Advantage 2',
                  headingLevel: 'h3',
                  settings: {},
                  id: 'cee4cf38-974a-46e8-bf3a-758d55ac95e4',
                },
                {
                  type: 'text',
                  content: 'I want this word underlined',
                  settings: {},
                  id: '9e1f94d6-c021-43f4-8297-9954f87ea56b',
                },
              ],
              id: '64724e53-959c-4e9d-824b-63602fbb868e',
              styles: {},
            },
          ],
          id: '85c51dde-8f4b-4260-bbb8-62e9af295efe',
        },
        {
          type: 'row',
          settings: {
            alignItems: 'flex-start',
          },
          cols: [
            {
              content: [
                {
                  type: 'title',
                  content: 'Premium',
                  headingLevel: 'h4',
                  settings: {},
                  id: '8b378b96-2aa3-428a-baa4-af703f57c55a',
                },
                {
                  type: 'button',
                  content: 'Click me!',
                  action: 'link',
                  url: '',
                  settings: {
                    buttonType: 'button',
                  },
                  id: '297c9eff-c7f0-4054-b36c-060888137973',
                },
              ],
              id: 'e3f0186a-ac56-4140-9fe3-892b4ec69d65',
              styles: {},
            },
            {
              content: [
                {
                  type: 'title',
                  content: 'Classic',
                  headingLevel: 'h4',
                  settings: {},
                  id: '191a02ec-150c-4d14-82a7-2b159ea572e1',
                },
                {
                  type: 'button',
                  content: 'Click me!',
                  action: 'link',
                  url: '',
                  settings: {
                    buttonType: 'button',
                  },
                  id: 'a6bd1c99-f61c-40f3-8abe-90c545b21533',
                },
              ],
              id: '42274a39-a794-4e63-abb3-0c9b7e3f72b7',
              styles: {},
            },
            {
              type: 'col',
              content: [
                {
                  type: 'title',
                  content: 'Student',
                  headingLevel: 'h4',
                  settings: {},
                  id: '7d70a1ca-54a0-4d7b-b58d-7edde3145c4a',
                },
                {
                  type: 'text',
                  content: '* you have to be a real student ',
                  settings: {},
                  id: '63e43387-e0f2-4ab3-97a5-655511ca0083',
                },
                {
                  type: 'button',
                  content: 'Click me!',
                  action: 'link',
                  url: '',
                  settings: {
                    buttonType: 'button',
                  },
                  id: '1395094d-b06d-4158-9180-d8a10d8ffe6f',
                },
              ],
              id: 'dc4513aa-f169-4240-8240-5209ef19884b',
              styles: {},
            },
          ],
          id: 'eabe5e7d-f465-45c2-976a-7b4547e7bcaa',
        },
        {
          type: 'row',
          settings: {
            alignItems: 'flex-start',
          },
          cols: [
            {
              type: 'col',
              content: [
                {
                  type: 'text',
                  content: "we (don't) care your privacy",
                  settings: {},
                  id: '27cd83d4-25b9-477f-8077-2bf7119be6e8',
                },
              ],
              id: 'cc64f6bf-e138-47ed-bc0b-a7a434445c06',
              styles: {},
              size: 5,
            },
          ],
          id: '8bdf90df-7955-4e95-b2ce-76ac2e1a1566',
        },
      ],
    });
  }, []);

  const setTexts = field => {
    oakRef.current?.setTexts(field.value);
  };

  return (
    <div>
      <div>
        <SelectField
          style={{ marginBottom: 50 }}
          placeholder="Language"
          options={[
            { title: 'Default (english)', value: {} },
            { title: 'French', value: { ...french, ...basicFrench } },
          ]}
          parseTitle={o => o.title}
          parseValue={o => o.value}
          onChange={setTexts}
        />
      </div>
      <div ref={containerRef} id="container" />
    </div>
  );
};
