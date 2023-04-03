import { fireEvent, render, within } from '@testing-library/react';

import { BuilderLite } from '../../tests/utils';
import { baseAddon } from '../addons';
import Container from './index';

describe('<Container />', () => {
  const getOptions = props => {
    let i = 0;

    return {
      generateId: () => i++,
      ...props,
    };
  };

  it('should render', () => {
    const elmt = { id: '1', type: 'foldable', content: [] };
    const { container, unmount } = render(
      <BuilderLite options={getOptions()} addons={[baseAddon()]}>
        <Container
          element={elmt}
          content={elmt.content}
        />
      </BuilderLite>
    );
    expect(container).toMatchSnapshot();

    // Open catalogue
    const catalogue = container.querySelector('.catalogue');
    fireEvent.click(within(catalogue).getByText('add'));

    // Add a text
    fireEvent.click(within(container).getByText('Text'));

    expect(elmt).toMatchSnapshot('With element added');
    unmount();
  });

  it('should allow to prepend elements inside a container', () => {
    const elmt = { id: '1', type: 'foldable', content: [
      { id: '2', type: 'text', content: 'This is a text' },
    ] };

    const { container, unmount } = render(
      <BuilderLite options={getOptions()} addons={[baseAddon()]}>
        <Container
          element={elmt}
          content={elmt.content}
        />
      </BuilderLite>
    );

    // Open catalogue
    const catalogue = container.querySelector('.catalogue:first-child');
    fireEvent.click(within(catalogue).getByText('add'));

    // Add a text
    const menu = container.querySelector('.catalogue-menu');
    fireEvent.click(within(menu).getByText('Text'));

    expect(elmt).toMatchSnapshot('With element added before');
    unmount();
  });
});
