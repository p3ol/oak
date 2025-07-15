import { fireEvent, render, screen } from '@testing-library/react';

import { BuilderLite } from '../../tests/utils';
import Catalogue from './index';

describe('<Catalogue />', () => {
  it('should allow to add elements to the builder', () => {
    const onAppend = jest.fn();
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
        <Catalogue onAppend={onAppend} />
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
