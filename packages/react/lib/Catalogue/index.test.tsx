import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
});
