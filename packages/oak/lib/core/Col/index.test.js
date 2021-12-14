import { render, fireEvent } from '@testing-library/react';

import { withBuilder } from '@tests-utils';
import Col from '.';

describe('Col', () => {
  it('should render component', () => {
    const element = { type: 'col', content: [] };
    const { container, debug } = render(<Col element={element} />);
    expect(container.querySelector('.oak-col')).toBeTruthy();
    debug();
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
