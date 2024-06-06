import type { BuilderObject, ElementObject } from '@oakjs/core';
import { fireEvent, render, within } from '@testing-library/react';

import { BuilderLite } from '../../tests/utils';
import { baseAddon } from '../addons';
import Container from './index';

describe('<Container />', () => {
  const getOptions = (props?: BuilderObject) => {
    let i = 0;

    return {
      generateId: () => i++,
      ...props,
    };
  };

  it('should render', () => {
    const elmt: ElementObject = {
      id: '1',
      type: 'foldable',
      content: [],
    };

    const { container, unmount } = render(
      <BuilderLite options={getOptions()} addons={[baseAddon()]}>
        <Container
          element={elmt}
          content={elmt.content as ElementObject[]}
        />
      </BuilderLite>
    );
    expect(container).toMatchSnapshot();

    // Open catalogue
    const catalogue = container.querySelector<HTMLElement>('.catalogue');
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
    const catalogue = container
      .querySelector<HTMLElement>('.catalogue:first-child');
    fireEvent.click(within(catalogue).getByText('add'));

    // Add a text
    const menu = container.querySelector<HTMLElement>('.catalogue-menu');
    fireEvent.click(within(menu).getByText('Text'));

    expect(elmt).toMatchSnapshot('With element added before');
    unmount();
  });
});
