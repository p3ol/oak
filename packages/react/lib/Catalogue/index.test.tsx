import type { AddonObject, ComponentObject } from '@oakjs/core';
import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { BuilderLite } from '../../tests/utils';
import Catalogue, { type CatalogueRef } from './index';

describe('<Catalogue />', () => {
  it('should allow to add elements to the builder', () => {
    const ref = createRef<CatalogueRef>();
    const onAppend = vi.fn(() => {
      ref.current?.close();
    });
    const { container, unmount } = render(
      <BuilderLite
        addons={[{
          components: [{
            id: 'test',
            group: 'core',
            type: 'component',
            name: 'Test component',
            construct: () => ({ type: 'test', content: 'Foo' }),
          }],
        }]}
      >
        <Catalogue ref={ref} onAppend={onAppend} />
      </BuilderLite>
    );

    expect(container).toMatchSnapshot('Closed');

    fireEvent.click(screen.getAllByText('add')[0]);

    expect(container).toMatchSnapshot('Opened');

    fireEvent.click(screen.getByText('Test component'));

    expect(onAppend).toHaveBeenCalledTimes(1);

    unmount();
  });

  describe('Paste from clipboard', () => {
    const components = [{
      id: 'allowed',
      group: 'core',
      type: 'component',
      name: 'Allowed component',
      construct: () => ({ type: 'allowed' }),
    }, {
      id: 'forbidden',
      group: 'core',
      type: 'component',
      name: 'Forbidden component',
      construct: () => ({ type: 'forbidden' }),
    }];

    const openWithClipboard = async (
      clipboard: any,
      {
        component = { id: 'parent' } as ComponentObject,
        addons = [] as AddonObject[],
        onPaste = vi.fn(),
      } = {},
    ) => {
      Object.defineProperty(globalThis.navigator, 'clipboard', {
        configurable: true,
        value: { readText: vi.fn(async () => JSON.stringify(clipboard)) },
      });

      const result = render(
        <BuilderLite addons={[{ components }, ...addons]}>
          <Catalogue component={component} onPaste={onPaste} />
        </BuilderLite>
      );

      await act(async () => {
        fireEvent.click(screen.getAllByText('add')[0]);
      });

      return result;
    };

    afterEach(() => {
      delete (globalThis.navigator as any).clipboard;
    });

    it('should allow to paste an allowed element', async () => {
      const onPaste = vi.fn();
      const { unmount } = await openWithClipboard(
        { type: 'allowed' },
        { onPaste }
      );

      fireEvent.click(screen.getByText('Paste from clipboard'));

      expect(onPaste).toHaveBeenCalledWith(
        { type: 'allowed' },
        expect.anything()
      );

      unmount();
    });

    it('should allow to paste multiple allowed elements', async () => {
      const { unmount } = await openWithClipboard(
        [{ type: 'allowed' }, { type: 'allowed' }],
      );

      expect(screen.queryByText('Paste from clipboard')).toBeTruthy();

      unmount();
    });

    it('should not allow to paste an element disallowed by the parent ' +
      'component', async () => {
      const { unmount } = await openWithClipboard({ type: 'forbidden' }, {
        component: { id: 'parent', disallow: ['forbidden'] } as ComponentObject,
      });

      expect(screen.queryByText('Paste from clipboard')).toBeNull();

      unmount();
    });

    it('should not allow to paste an element disallowed by a parent ' +
      'override', async () => {
      const { unmount } = await openWithClipboard({ type: 'forbidden' }, {
        addons: [{
          overrides: [{
            type: 'component',
            targets: ['parent'],
            disallow: ['forbidden'],
          }],
        }],
      });

      expect(screen.queryByText('Paste from clipboard')).toBeNull();

      unmount();
    });

    it('should not allow to paste multiple elements if one of them is ' +
      'disallowed', async () => {
      const { unmount } = await openWithClipboard(
        [{ type: 'allowed' }, { type: 'forbidden' }],
        {
          component: {
            id: 'parent',
            disallow: ['forbidden'],
          } as ComponentObject,
        }
      );

      expect(screen.queryByText('Paste from clipboard')).toBeNull();

      unmount();
    });
  });
});
