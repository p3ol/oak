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

    expect(container.querySelector('.oak-foldable-content')).toBeTruthy();
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
    let seeMore = container.querySelectorAll('.oak-foldable-content')[0];
    let seeLess = container.querySelectorAll('.oak-foldable-content')[1];
    let content = container.querySelectorAll('.oak-foldable-content')[2];

    expect(content.querySelectorAll('.oak-element').length).toEqual(3);
    expect(seeMore.querySelectorAll('.oak-element').length).toEqual(0);
    expect(seeLess.querySelectorAll('.oak-element').length).toEqual(0);

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
    seeMore = container.querySelectorAll('.oak-foldable-content')[0];
    seeLess = container.querySelectorAll('.oak-foldable-content')[1];
    content = container.querySelectorAll('.oak-foldable-content')[2];

    expect(content.querySelectorAll('.oak-element').length).toEqual(0);
    expect(seeMore.querySelectorAll('.oak-element').length).toEqual(2);
    expect(seeLess.querySelectorAll('.oak-element').length).toEqual(0);

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
    seeMore = container.querySelectorAll('.oak-foldable-content')[0];
    seeLess = container.querySelectorAll('.oak-foldable-content')[1];
    content = container.querySelectorAll('.oak-foldable-content')[2];

    expect(content.querySelectorAll('.oak-element').length).toEqual(0);
    expect(seeMore.querySelectorAll('.oak-element').length).toEqual(0);
    expect(seeLess.querySelectorAll('.oak-element').length).toEqual(4);
    unmount();
  });

  it('should display no content if a section is empty', () => {
    const { container, unmount } = render(withBuilder(
      <Foldable
        element={{
          content: [],
          seeMore: [],
          seeLess: [],
        }}
      />
    ));
    const content = container.querySelectorAll('.oak-foldable-content')[0];
    const seeMore = container.querySelectorAll('.oak-foldable-content')[1];
    const seeLess = container.querySelectorAll('.oak-foldable-content')[2];

    expect(content.querySelectorAll('.oak-element').length).toEqual(0);
    expect(seeMore.querySelectorAll('.oak-element').length).toEqual(0);
    expect(seeLess.querySelectorAll('.oak-element').length).toEqual(0);

    expect(content.querySelector('.oak-foldable-content-empty'))
      .not.toBeUndefined();
    expect(seeMore.querySelector('.oak-foldable-content-empty'))
      .not.toBeUndefined();
    expect(seeLess.querySelector('.oak-foldable-content-empty'))
      .not.toBeUndefined();
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
    let seeMore = container.querySelectorAll('.oak-foldable-content')[0];
    let seeLess = container.querySelectorAll('.oak-foldable-content')[1];
    let content = container.querySelectorAll('.oak-foldable-content')[2];

    expect(content.querySelectorAll('.oak-catalogue').length).toEqual(1);
    expect(seeMore.querySelectorAll('.oak-catalogue').length).toEqual(1);
    expect(seeLess.querySelectorAll('.oak-catalogue').length).toEqual(1);

    rerender(withBuilder(
      <Foldable
        element={{
          content: [{ type: 'row', cols: [], id: 1 }],
          seeMore: [{ type: 'row', cols: [], id: 2 }],
          seeLess: [{ type: 'row', cols: [], id: 3 }],
        }}
      />
    ));

    seeMore = container.querySelectorAll('.oak-foldable-content')[0];
    seeLess = container.querySelectorAll('.oak-foldable-content')[1];
    content = container.querySelectorAll('.oak-foldable-content')[2];

    expect(content.querySelectorAll('.oak-catalogue').length).toEqual(2);
    expect(seeMore.querySelectorAll('.oak-catalogue').length).toEqual(2);
    expect(seeLess.querySelectorAll('.oak-catalogue').length).toEqual(2);
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

    const content = container.querySelectorAll('.oak-foldable-content')[2];
    const contentToDelete = { type: 'row', cols: [], id: 3 };
    expect(content.querySelectorAll('.oak-element').length).toEqual(4);

    fireEvent.click(content.querySelectorAll('.oak-remove')[2]);
    await waitFor(() =>
      expect(mockRemoveElement)
        .toHaveBeenCalledWith(contentToDelete, expect.any(Object))
    );
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
    const { container, rerender, unmount } = render(withBuilder(
      <Foldable
        element={element}
      />
      , { addElement: mockAddElement, components: groupMock }));

    let content = container.querySelectorAll('.oak-foldable-content')[2];

    fireEvent.click(content.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(
      () => expect(
        content.querySelector('.oak-popover .oak-components')
      ).not.toBeUndefined()
    );

    content = container.querySelectorAll('.oak-foldable-content')[2];

    let popover = content.querySelector('.oak-popover .oak-components');
    fireEvent.click(popover.querySelector('.oak-components .oak-component a'));

    await waitFor(() => expect(mockAddElement).toHaveBeenCalledWith({
      type: 'my-component',
      settings: {},
      content: [],
    }, { parent: element.content, position: 'before' }));

    rerender(withBuilder(
      <Foldable
        element={element}
      />
      , { addElement: mockAddElement, components: groupMock }
    ));

    content = container.querySelectorAll('.oak-foldable-content')[2];

    fireEvent.click(content.querySelectorAll('.oak-catalogue .oak-handle')[1]);
    await waitFor(
      () => expect(
        content.querySelector('.oak-popover .oak-components')
      ).not.toBeUndefined()
    );

    popover = content.querySelector('.oak-popover .oak-components');
    fireEvent.click(popover.querySelector('.oak-components .oak-component a'));

    await waitFor(() => expect(mockAddElement).toHaveBeenCalledWith({
      type: 'my-component',
      settings: {},
      content: [],
    }, { parent: element.content, position: 'after' }));
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
    const { container, unmount } = render(withBuilder(
      <Foldable
        element={element}
      />
      , { addElement: mockAddElement, components: groupMock }
    ));

    //adding on content
    let content = container.querySelectorAll('.oak-foldable-content')[2];

    fireEvent.click(content.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(
      () => expect(
        content.querySelector('.oak-popover .oak-components')
      ).not.toBeUndefined()
    );

    content = container.querySelectorAll('.oak-foldable-content')[2];

    let popover = content.querySelector('.oak-popover .oak-components');
    fireEvent.click(popover.querySelector('.oak-components .oak-component a'));

    await waitFor(() => expect(mockAddElement).toHaveBeenCalledWith({
      type: 'my-component',
      settings: {},
      content: [],
    }, { parent: element.content, position: 'before' }));

    // adding on see more
    content = container.querySelectorAll('.oak-foldable-content')[0];

    fireEvent.click(content.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(
      () => expect(
        content.querySelector('.oak-popover .oak-components')
      ).not.toBeUndefined()
    );

    content = container.querySelectorAll('.oak-foldable-content')[0];

    popover = content.querySelector('.oak-popover .oak-components');
    fireEvent.click(popover.querySelector('.oak-components .oak-component a'));

    await waitFor(() => expect(mockAddElement).toHaveBeenCalledWith({
      type: 'my-component',
      settings: {},
      content: [],
    }, { parent: element.seeMore, position: 'before' }));

    // adding on see less
    content = container.querySelectorAll('.oak-foldable-content')[1];

    fireEvent.click(content.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(
      () => expect(
        content.querySelector('.oak-popover .oak-components')
      ).not.toBeUndefined()
    );

    content = container.querySelectorAll('.oak-foldable-content')[1];

    popover = content.querySelector('.oak-popover .oak-components');
    fireEvent.click(popover.querySelector('.oak-components .oak-component a'));

    await waitFor(() => expect(mockAddElement).toHaveBeenCalledWith({
      type: 'my-component',
      settings: {},
      content: [],
    }, { parent: element.seeLess, position: 'before' }));
    unmount();
  });
});
