import { useState } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BuilderObject } from '@oakjs/core';

import { baseAddon } from '../addons';
import Builder from './index';

describe('<Builder />', () => {
  const getOptions = (props?: BuilderObject) => {
    let i = 0;

    return {
      generateId: () => i++,
      ...props,
    };
  };

  it('should render', () => {
    const content = [
      { type: 'title', content: 'This is a title' },
      { type: 'text', content: 'This is a text' },
    ];

    const { container, unmount } = render(
      <Builder
        value={content}
        addons={[baseAddon()]}
        options={getOptions()}
      />
    );

    expect(container).toMatchSnapshot('Base content');
    unmount();
  });

  it('should allow to add content programmatically', () => {
    const Comp = () => {
      const [content, setContent] = useState([]);

      return (
        <div>
          <button
            data-testid="button"
            onClick={() => setContent(c => [
              ...c,
              { type: 'title', content: 'This is a title' },
            ])}
          >
            Add title
          </button>
          <Builder
            value={content}
            addons={[baseAddon()]}
            options={getOptions()}
          />
        </div>
      );
    };

    const { container, unmount } = render(<Comp />);

    expect(container).toMatchSnapshot('Empty content');

    fireEvent.click(screen.getByTestId('button'));

    expect(container).toMatchSnapshot('Content with title');
    unmount();
  });

  it('should allow to add content from catalogue', () => {
    const { container, unmount } = render(
      <Builder
        addons={[baseAddon()]}
        options={getOptions()}
      />
    );

    expect(container).toMatchSnapshot('Empty content');

    const floatings = container.querySelector<HTMLElement>('.floatings');
    const catalogue = container.querySelector<HTMLElement>('.catalogue');

    // Open catalogue
    fireEvent.click(within(catalogue).getByText('add'));
    expect(floatings).toMatchSnapshot('Catalogue opened');

    // Add a row
    fireEvent.click(within(floatings).getByText('Row'));

    // Catalogue should be closed and the row should have been added to content
    expect(container).toMatchSnapshot('Content with row');

    // Open row's first col catalogue
    const row = container.querySelector<HTMLElement>('.element.type-row');
    const col = row.querySelector<HTMLElement>('.column .col-inner');
    fireEvent.click(within(col).getByText('add'));

    // Add a title
    fireEvent.click(within(floatings).getByText('Title'));

    // Col should have a title
    expect(row).toMatchSnapshot('Row with title');

    // Open main prepend catalogue
    const prependCatalogue = container
      .querySelectorAll<HTMLElement>('.catalogue')[0];
    fireEvent.click(within(prependCatalogue).getByText('add'));

    // Add a text
    fireEvent.click(within(floatings).getByText('Text'));
    expect(container).toMatchSnapshot('Content with text and row');

    unmount();
  });

  it('should allow to render editable inside a modal', () => {
    const { container, unmount } = render(
      <Builder
        addons={[baseAddon()]}
        editableType="modal"
      />
    );

    const floatings = container.querySelector<HTMLElement>('.floatings');
    const catalogue = container.querySelector<HTMLElement>('.catalogue');

    // Open catalogue
    fireEvent.click(within(catalogue).getByText('add'));
    expect(floatings).toMatchSnapshot('Catalogue opened');

    // Add a title
    fireEvent.click(within(floatings).getByText('Title'));

    // Edit title
    fireEvent.click(within(container).getByText('pen'));

    expect(container).toMatchSnapshot('Title editable');

    unmount();
  });
});
