import { fireEvent, render, waitFor } from '@testing-library/react';
import Builder from '.';
import { withBuilder } from '@tests-utils';

describe('Builder', () => {
  it('should render', () => {
    const { container, unmount } = render(<Builder />);
    expect(container.querySelector('.oak-builder')).toBeTruthy();
    expect(container.querySelector('.oak-undo-redo')).toBeTruthy();
    unmount();
  });

  it('should not display undo redo on builder if' +
  ' history button is disabled', () => {
    const { container, unmount } = render(withBuilder(<Builder />, {
      options: { historyButtonsEnabled: false },
    }));
    expect(container.querySelector('.oak-undo-redo')).toBeFalsy();
    unmount();
  });

  it('should display debug mode if explicitly added in options', async () => {
    const { container, unmount } = render(withBuilder(<Builder />, {
      options: { debug: true },
    }));
    expect(container.querySelector('pre')).toBeTruthy();
    unmount();
  });

  it('should call context\'s addElement method when ' +
  'appending a new element', async () => {
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
    const { getByText, container, unmount } = render(withBuilder(<Builder />, {
      addElement: addElementMock,
      components,
      getOverrides: () => ({}),
    }));

    await waitFor(() => {
      fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    });

    fireEvent.click(getByText('component 1'));
    expect(addElementMock).toHaveBeenCalledWith(component);

    unmount();
  });

  it('should call undo and redo when clicking ' +
  'if they\'re available', async () => {
    const undoMock = jest.fn();
    const redoMock = jest.fn();

    const { container, unmount } = render(withBuilder(<Builder />, {
      isRedoPossible: true,
      isUndoPossible: true,
      undo: undoMock,
      redo: redoMock,
    }));
    fireEvent.click(container.querySelector('.oak-undo-redo .oak-undo'));
    fireEvent.click(container.querySelector('.oak-undo-redo .oak-redo'));

    expect(
      container.querySelector('.oak-undo-redo .oak-undo').className
    ).not.toContain('disabled');
    expect(
      container.querySelector('.oak-undo-redo .oak-redo').className
    ).not.toContain('disabled');
    fireEvent.click(container.querySelector('.oak-undo-redo .oak-undo'));
    fireEvent.click(container.querySelector('.oak-undo-redo .oak-redo'));
    expect(undoMock).toHaveBeenCalled();
    expect(redoMock).toHaveBeenCalled();

    unmount();
  });

  it('should notcall undo and redo when clicking ' +
  'if they\'re unavailable', async () => {
    const undoMock = jest.fn();
    const redoMock = jest.fn();

    const { container, unmount } = render(withBuilder(<Builder />, {
      isRedoPossible: false,
      isUndoPossible: false,
      undo: undoMock,
      redo: redoMock,
    }));

    expect(
      container.querySelector('.oak-undo-redo .oak-undo').className
    ).toContain('disabled');
    expect(
      container.querySelector('.oak-undo-redo .oak-redo').className
    ).toContain('disabled');
    fireEvent.click(container.querySelector('.oak-undo-redo .oak-undo'));
    fireEvent.click(container.querySelector('.oak-undo-redo .oak-redo'));

    expect(undoMock).not.toHaveBeenCalled();
    expect(redoMock).not.toHaveBeenCalled();
    unmount();
  });

  it('should allow to copy/paste an element', async () => {
    const addElementMock = jest.fn();
    const { container, queryByText, unmount } = render(withBuilder(
      <Builder />,
      {
        getComponent: () => ({ type: 'text' }),
        addElement: addElementMock,
      }
    ));

    globalThis.navigator.clipboard
      .writeText('{"type":"text","content":"Pasted element"}');

    await waitFor(() => {
      fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    });

    expect(queryByText('Pasted element')).toBeFalsy();

    await waitFor(() => {
      fireEvent
        .click(container.querySelector('.oak-catalogue a.oak-clipboard'));
    });

    expect(addElementMock).toHaveBeenCalledWith({
      type: 'text', content: 'Pasted element',
    }, expect.anything());
    unmount();
  });
});
