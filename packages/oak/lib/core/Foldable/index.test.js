import { fireEvent, render, waitFor } from '@testing-library/react';
import { withBuilder } from '@tests-utils';

import Foldable from '.';

describe('<Foldable />', () => {
  it('should render', () => {
    const { container, unmount } = render(withBuilder((
      <Foldable
        element={{
          content: [],
          seeMore: [],
          seeLess: [],
        }}
      />
    )));

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render as many content as given on each section', () => {
    const { container, rerender, unmount } = render(withBuilder(
      <Foldable
        element={{
          content: [
            { type: 'row', cols: [], id: 1 },
            { type: 'row', cols: [], id: 2 },
            { type: 'row', cols: [], id: 3 },
          ],
          seeMore: [],
          seeLess: [],
        }}
      />
    ));

    expect(container).toMatchSnapshot('3 rows');

    rerender(withBuilder(
      <Foldable
        element={{
          content: [],
          seeMore: [
            { type: 'row', cols: [], id: 1 },
            { type: 'row', cols: [], id: 2 },
          ],
          seeLess: [],
        }}
      />
    ));

    expect(container).toMatchSnapshot('2 rows');

    rerender(withBuilder(
      <Foldable
        element={{
          content: [],
          seeMore: [],
          seeLess: [
            { type: 'row', cols: [], id: 1 },
            { type: 'row', cols: [], id: 2 },
            { type: 'row', cols: [], id: 3 },
            { type: 'row', cols: [], id: 4 },
          ],
        }}
      />
    ));

    expect(container).toMatchSnapshot('4 rows');

    unmount();
  });

  it('should display one catalog if content is empty and two if not', () => {
    const { container, rerender, unmount } = render(withBuilder(
      <Foldable
        element={{
          content: [],
          seeMore: [],
          seeLess: [],
        }}
      />
    ));

    expect(container).toMatchSnapshot('No content');

    rerender(withBuilder(
      <Foldable
        element={{
          content: [{ type: 'row', cols: [], id: 1 }],
          seeMore: [{ type: 'row', cols: [], id: 2 }],
          seeLess: [{ type: 'row', cols: [], id: 3 }],
        }}
      />
    ));

    expect(container).toMatchSnapshot('With content');

    unmount();
  });

  it('should remove the correct content', async () => {
    const mockRemoveElement = jest.fn();
    const { container, unmount } = render(withBuilder(
      <Foldable
        element={{
          content: [
            { type: 'row', cols: [], id: 1 },
            { type: 'row', cols: [], id: 2 },
            { type: 'row', cols: [], id: 3 },
            { type: 'row', cols: [], id: 4 },
          ],
          seeMore: [],
          seeLess: [],
        }}
      />
      , { removeElement: mockRemoveElement }));

    const content = container
      .querySelectorAll('.oak-foldable-section-content')[2];
    const contentToDelete = { type: 'row', cols: [], id: 3 };
    expect(content.querySelectorAll('.oak-element').length).toEqual(4);

    fireEvent.click(content.querySelectorAll('.oak-remove')[2]);
    await waitFor(() => {
      expect(mockRemoveElement)
        .toHaveBeenCalledWith(contentToDelete, expect.any(Object))
    });

    unmount();
  });

  it('should add the right element', async () => {
    const mockConstruct = jest.fn().mockReturnValue({
      type: 'my-component',
      settings: {},
      content: [],
    });
    const componentMock = {
      id: 'first-component',
      name: 'component 1',
      construct: mockConstruct,
    };
    const groupMock = [{
      type: 'group',
      id: 'group1',
      name: 'group 1',
      components: [],
    }, {
      group: 'group1',
      component: componentMock,
    }];
    const element = {
      content: [{ type: 'text', content: [], id: 1 }],
      seeMore: [],
      seeLess: [],
    };
    const mockAddElement = jest.fn();
    const { container, rerender, unmount } = render(withBuilder((
      <Foldable element={element} />
    ), { addElement: mockAddElement, components: groupMock }));

    let content = container
      .querySelectorAll('.oak-foldable-section-content')[2];

    fireEvent.click(content.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => {
      expect(
        content.querySelector('.oak-popover .oak-components')
      ).toBeTruthy();
    });

    content = container.querySelectorAll('.oak-foldable-section-content')[2];

    let popover = content.querySelector('.oak-popover .oak-components');
    fireEvent.click(popover.querySelector('.oak-components .oak-component a'));

    await waitFor(() => {
      expect(mockAddElement).toHaveBeenCalledWith({
        type: 'my-component',
        settings: {},
        content: [],
      }, { parent: element.content, position: 'before' });
    });

    rerender(withBuilder((
      <Foldable element={element} />
    ), { addElement: mockAddElement, components: groupMock }));

    content = container.querySelectorAll('.oak-foldable-section-content')[2];

    fireEvent.click(content.querySelectorAll('.oak-catalogue .oak-handle')[1]);
    await waitFor(() => {
      expect(
        content.querySelector('.oak-popover .oak-components')
      ).toBeTruthy();
    });

    popover = content.querySelector('.oak-popover .oak-components');
    fireEvent.click(popover.querySelector('.oak-components .oak-component a'));

    await waitFor(() => {
      expect(mockAddElement).toHaveBeenCalledWith({
        type: 'my-component',
        settings: {},
        content: [],
      }, { parent: element.content, position: 'after' });
    });

    expect(mockConstruct).toHaveBeenCalledTimes(2);
    unmount();
  });

  it('should add content on the right section', async () => {
    const mockConstruct = jest.fn().mockReturnValue({
      type: 'my-component',
      settings: {},
      content: [],
    });
    const componentMock = {
      id: 'first-component',
      name: 'component 1',
      construct: mockConstruct,
    };
    const groupMock = [{
      type: 'group',
      id: 'group1',
      name: 'group 1',
      components: [],
    }, {
      group: 'group1',
      component: componentMock,
    }];
    const element = {
      content: [{ type: 'text', content: [], id: 1 }],
      seeMore: [{ type: 'button', content: [], id: 1 }],
      seeLess: [{ type: 'title', content: [], id: 1 }],
    };
    const mockAddElement = jest.fn();
    const { container, unmount } = render(withBuilder((
      <Foldable element={element} />
    ), { addElement: mockAddElement, components: groupMock }));

    //adding on content
    let content = container
      .querySelectorAll('.oak-foldable-section-content')[2];

    fireEvent.click(content.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => {
      expect(
        content.querySelector('.oak-popover .oak-components')
      ).toBeTruthy();
    });

    content = container.querySelectorAll('.oak-foldable-section-content')[2];

    let popover = content.querySelector('.oak-popover .oak-components');
    fireEvent.click(popover.querySelector('.oak-components .oak-component a'));

    await waitFor(() => {
      expect(mockAddElement).toHaveBeenCalledWith({
        type: 'my-component',
        settings: {},
        content: [],
      }, { parent: element.content, position: 'before' });
    });

    // adding on see more
    content = container.querySelectorAll('.oak-foldable-section-content')[0];

    fireEvent.click(content.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => {
      expect(
        content.querySelector('.oak-popover .oak-components')
      ).toBeTruthy();
    });

    content = container.querySelectorAll('.oak-foldable-section-content')[0];

    popover = content.querySelector('.oak-popover .oak-components');
    fireEvent.click(popover.querySelector('.oak-components .oak-component a'));

    await waitFor(() => {
      expect(mockAddElement).toHaveBeenCalledWith({
        type: 'my-component',
        settings: {},
        content: [],
      }, { parent: element.seeMore, position: 'before' });
    });

    // adding on see less
    content = container.querySelectorAll('.oak-foldable-section-content')[1];

    fireEvent.click(content.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => {
      expect(
        content.querySelector('.oak-popover .oak-components')
      ).toBeTruthy();
    });

    content = container.querySelectorAll('.oak-foldable-section-content')[1];

    popover = content.querySelector('.oak-popover .oak-components');
    fireEvent.click(popover.querySelector('.oak-components .oak-component a'));

    await waitFor(() => {
      expect(mockAddElement).toHaveBeenCalledWith({
        type: 'my-component',
        settings: {},
        content: [],
      }, { parent: element.seeLess, position: 'before' });
    });
    unmount();
  });
});
