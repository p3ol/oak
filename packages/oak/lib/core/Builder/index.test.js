import { fireEvent, render } from '@testing-library/react';
import Builder from '.';
import { withBuilder } from '@tests-utils';

describe('Builder', () => {
  it('should render', () => {
    const { container } = render(<Builder />);
    expect(container.querySelector('.oak-builder')).toBeTruthy();
    expect(container.querySelector('.oak-undo-redo')).toBeTruthy();
  });

  it('should not display undo redo on builder if' +
  ' history button is disabled', () => {
    const { container } = render(withBuilder(<Builder />, {
      options: { historyButtonsEnabled: false },
    }));
    expect(container.querySelector('.oak-undo-redo')).toBeFalsy();
  });

  it('should display debug mode if explicitly added in options', async () => {
    const { container } = render(withBuilder(<Builder />, {
      options: { debug: true },
    }));
    expect(container.querySelector('pre')).toBeTruthy();
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
    const { getByText, container } = render(withBuilder(<Builder />, {
      addElement: addElementMock,
      components,
    }));
    fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    fireEvent.click(getByText('component 1'));
    expect(addElementMock).toHaveBeenCalledWith(component);
  });

  it('should call undo and redo when clicking ' +
  'if they\'re available', async () => {
    const undoMock = jest.fn();
    const redoMock = jest.fn();

    const { container } = render(withBuilder(<Builder />, {
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

  });

  it('should notcall undo and redo when clicking ' +
  'if they\'re unavailable', async () => {
    const undoMock = jest.fn();
    const redoMock = jest.fn();

    const { container } = render(withBuilder(<Builder />, {
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
  });
});
