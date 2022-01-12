import { render, fireEvent, waitFor } from '@testing-library/react';

import { withBuilder } from '@tests-utils';
import Col from '.';

describe('Col', () => {
  it('should render component', () => {
    const element = { type: 'col', content: [] };
    const { container } = render(<Col element={element} />);
    expect(container.querySelector('.oak-col')).toBeTruthy();
  });

  it('should display just one catalog button when content is empty', () => {
    const element = { type: 'col', content: [] };
    const components = [
      {
        type: 'group',
        id: 'group1',
        name: 'group 1',
        components: [],
      }, {
        group: 'group1',
        component: {
          id: 'first-component',
          name: 'component 1',
        },
      },
    ];

    const { container } = render(withBuilder(
      <Col element={element} />,
      {
        components,
      }
    ));

    expect(container.querySelectorAll('.oak-catalogue').length).toEqual(1);
  });

  it('should display two catalog buttons when content is not empty', () => {
    const element = { type: 'col', content: [{}] };

    const { container } = render(withBuilder(
      <Col element={element} />,
      {
        getComponent: () => jest.fn(),
      }
    ));

    expect(container.querySelectorAll('.oak-catalogue').length).toEqual(2);
  });

  it('should display as many component as in col content', () => {
    const element = { type: 'col', content: [{}, {}] };

    const { container } = render(withBuilder(<Col element={element} />, {
      getComponent: () => jest.fn(),
    }));

    expect(container.querySelectorAll('.oak-element').length).toEqual(2);
  });

  it('should set differents ids to each component', () => {
    const element = { type: 'col', content: [{}, {}, {}] };

    const { container } = render(withBuilder(<Col element={element} />, {
      getComponent: () => jest.fn(),
    }));

    const elements = container.querySelectorAll('.oak-element');

    expect(elements.length).toEqual(3);
    expect(elements[0].id).not.toEqual(elements[1].id);
    expect(elements[1].id).not.toEqual(elements[2].id);
    expect(elements[0].id).not.toEqual(elements[2].id);
  });

  it('should display the col options panel', () => {
    const element = { type: 'col', content: [] };

    const { container } = render(<Col element={element} />);

    expect(container.querySelector('.oak-options')).toBeTruthy();
  });

  it('should display oak edit panel after' +
  ' clicking on edit button', async () => {
    const element = { type: 'col', content: [] };
    const { container } = render(withBuilder(<Col element={element} />, {
      getComponent: () => jest.fn(),
      getOverrides: () => jest.fn(),
    }));
    expect(container.querySelector('.oak-editable')).toBeFalsy();
    fireEvent.click(container.querySelector('.oak-options .oak-edit'));
    await waitFor(() =>
      expect(container.querySelector('.oak-editable')).toBeTruthy()
    );
  });

  it('should call remove method after clicking on remove button', () => {
    const element = { type: 'col', content: [] };
    const removeMock = jest.fn();
    const { container } = render(
      <Col onRemove={removeMock} element={element} />
    );
    expect(removeMock).not.toHaveBeenCalled();
    fireEvent.click(container.querySelector('.oak-options .oak-remove'));
    expect(removeMock).toHaveBeenCalled();
  });

  it('should add element inside col when ' +
  'adding a new element via catalogue', () => {
    const component = {
      content: 'myContent',
      type: 'my-component-type',
      settings: {},
    };
    const addElementMock = jest.fn();
    const constructMock = jest.fn().mockImplementation(() => component);
    const components = [
      {
        type: 'group',
        id: 'group1',
        name: 'group 1',
        components: [],
      }, {
        group: 'group1',
        component: {
          id: 'first-component',
          name: 'component 1',
          construct: constructMock,
        },
      },
    ];
    const element = { type: 'col', content: [] };

    const { container, getByText } = render(withBuilder(
      <Col element={element} />,
      {
        components,
        addElement: addElementMock,
      }
    ));

    fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    fireEvent.click(getByText('component 1'));
    expect(addElementMock).toHaveBeenCalledWith(
      component,
      { parent: element.content, position: 'after' },
    );
  });
});
