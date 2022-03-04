import { fireEvent, render, waitFor } from '@testing-library/react';
import Element from '.';
import { withBuilder } from '@tests-utils';

describe('<Element />', () => {
  const component = {
    id: 'id',
    type: 'component',
    icon: 'view_column',
    editable: true,
  };
  it('should render', () => {
    const { container } = render(withBuilder((
      <Element
        element={{
          type: 'type',
          cols: [{
            type: 'type',
            content: [],
            id: 'my-id',
            style: {},
          }],
        }}
      />
    ), { getComponent: () => jest.fn() }));
    expect(container.querySelector('.oak-element')).toBeTruthy();
  });

  it('should remove element when clicking on remove cross', () => {
    const mockRemoveElement = jest.fn();
    const { container } = render(withBuilder((
      <Element
        element={{
          type: 'type',
          cols: [{
            type: 'type',
            content: [],
            id: 'my-id',
            style: {},
          }],
        }}
      />
    ), {
      getComponent: () => component,
      removeElement: mockRemoveElement,
    }));
    expect(container.querySelector('.oak-element')).toBeTruthy();
    fireEvent.click(container.querySelector('.oak-remove'));
    expect(mockRemoveElement).toHaveBeenCalled();
  });

  it('should duplicate element when clicking on duplicate button', () => {
    const mockDuplicateElement = jest.fn();
    const { container } = render(withBuilder((
      <Element
        element={{
          editable: true,
          type: 'type',
          cols: [{
            type: 'type',
            content: [],
            id: 'my-id',
            style: {},
          }],
        }}
      />
    ), {
      getComponent: () => component,
      duplicateElement: mockDuplicateElement,
    }));
    expect(container.querySelector('.oak-element')).toBeTruthy();
    fireEvent.click(container.querySelector('.oak-duplicate'));
    expect(mockDuplicateElement).toHaveBeenCalled();
  });

  it('should display edit button if component is editabled', () => {
    const mockDuplicateElement = jest.fn();
    const { container } = render(withBuilder((
      <Element
        element={{
          editable: true,
          type: 'type',
          cols: [{
            type: 'type',
            content: [],
            id: 'my-id',
            style: {},
          }],
        }}
      />
    ), {
      getComponent: () => component,
      duplicateElement: mockDuplicateElement,
    }));
    expect(container.querySelector('.oak-element')).toBeTruthy();
    expect(container.querySelector('.oak-edit')).toBeTruthy();
  });

  it('should not display edit button if component is not editabled', () => {
    const componentUneditable = { ...component, editable: false };
    const mockDuplicateElement = jest.fn();
    const { container } = render(withBuilder((
      <Element
        element={{
          editable: true,
          type: 'type',
          cols: [{
            type: 'type',
            content: [],
            id: 'my-id',
            style: {},
          }],
        }}
      />
    ), {
      getComponent: () => componentUneditable,
      duplicateElement: mockDuplicateElement,
    }));
    expect(container.querySelector('.oak-element')).toBeTruthy();
    expect(container.querySelector('.oak-edit')).not.toBeTruthy();
  });

  it('should open edit menu if component is editable ' +
  'and click on edit button ', async () => {
    const mockDuplicateElement = jest.fn();
    const { container } = render(withBuilder((
      <Element
        element={{
          editable: true,
          type: 'type',
          cols: [{
            type: 'type',
            content: [],
            id: 'my-id',
            style: {},
          }],
        }}
      />
    ), {
      getComponent: () => component,
      duplicateElement: mockDuplicateElement,
      getOverrides: () => jest.fn(),
    }));
    expect(container.querySelector('.oak-element')).toBeTruthy();
    expect(container.querySelector('.oak-editable')).not.toBeTruthy();
    fireEvent.click(container.querySelector('.oak-edit'));
    await waitFor(() => {
      expect(container.querySelector('.oak-editable')).toBeTruthy();
    });
  });
});
