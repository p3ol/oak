import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { ElementObject } from './types';
import * as client from './index';
import * as server from './server';

describe('server entrypoint', () => {
  it('should only export non-interactive renderers', () => {
    expect(Object.keys(server.serverComponents()).sort())
      .toEqual(['col', 'empty-space', 'image', 'row', 'text', 'title']);
    expect((server as Record<string, unknown>).Button).toBeUndefined();
    expect((server as Record<string, unknown>).Foldable).toBeUndefined();
    expect((server as Record<string, unknown>).Clickable).toBeUndefined();
  });

  it('should export the same helpers as the main entrypoint', () => {
    const helpers = Object.keys(client)
      .filter(k => typeof (client as any)[k] !== 'function' ||
        !/^[A-Z]/.test(k))
      .filter(k => k !== 'baseComponents');

    helpers.forEach(k => {
      expect(server).toHaveProperty(k);
    });
  });

  it('should render the same markup as the main entrypoint', () => {
    const content: ElementObject = {
      id: 'r',
      type: 'row',
      settings: { gap: 8 },
      cols: [{
        id: 'c',
        type: 'col',
        size: 6,
        content: [
          { id: 't', type: 'title', content: 'Title', headingLevel: 'h2' },
          { id: 'x', type: 'text', content: '<p>Text</p>' },
          { id: 'e', type: 'empty-space', settings: { height: 10 } },
          { id: 'i', type: 'image', url: 'https://example.com/a.png' },
        ],
      }],
    };

    const renderWith = (
      components: client.RendererComponentsMap,
      element: ElementObject,
    ): ReactNode => {
      const Component = components[element.type];

      return (
        <Component
          key={element.id}
          element={element}
          attributes={server.getElementAttributes(element, Component)}
          renderContainer={key => (element[key] || [])
            .map((child: ElementObject) => renderWith(components, child))}
        />
      );
    };

    expect(renderToStaticMarkup(renderWith(server.serverComponents(), content)))
      .toBe(renderToStaticMarkup(renderWith(client.baseComponents(), content)));
  });
});
