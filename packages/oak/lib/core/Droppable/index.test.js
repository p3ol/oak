import { createEvent, fireEvent, render } from '@testing-library/react';
import Droppable from '.';

describe('<Droppable />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Droppable><p>hello</p></Droppable>);
    expect(container.innerHTML).toContain('hello');
    unmount();
  });

  it('should add drag-enter classname when dragEnter', () => {
    const { container, unmount } = render(<Droppable><p>hello</p></Droppable>);
    fireEvent.dragEnter(container.querySelector('p'));
    expect(container.querySelector('p').className).toContain('drag-enter');
    unmount();
  });

  it('should add drag-top event on dragOver if element is on top', () => {
    const { container, unmount } = render(<Droppable><p>hello</p></Droppable>);
    fireEvent.dragEnter(container.querySelector('p'));
    const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
    Object.defineProperty(dragOverEvent, 'clientY', { value: -1 });
    fireEvent(container.querySelector('p'), dragOverEvent);
    expect(container.querySelector('p').className).toContain('drag-top');
    unmount();
  });

  it('should add drag-bottom event on dragOver if element is on bottom', () => {
    const { container, unmount } = render(<Droppable><p>hello</p></Droppable>);
    fireEvent.dragEnter(container.querySelector('p'));
    const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
    Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
    fireEvent(container.querySelector('p'), dragOverEvent);
    expect(container.querySelector('p').className).toContain('drag-bottom');
    unmount();
  });

  it('should reset dragging when leaving', () => {
    const { container, unmount } = render(<Droppable><p>hello</p></Droppable>);
    fireEvent.dragEnter(container.querySelector('p'));
    const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
    Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
    fireEvent(container.querySelector('p'), dragOverEvent);
    expect(container.querySelector('p').className).toContain('drag-bottom');
    fireEvent.dragLeave(container.querySelector('p'));
    expect(container.querySelector('p').className).not.toContain('drag-bottom');
    unmount();
  });

  it('should reset dragging and draggingPos on drop', () => {
    const { container, unmount } = render(<Droppable><p>hello</p></Droppable>);
    fireEvent.dragEnter(container.querySelector('p'));
    const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
    Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
    fireEvent(container.querySelector('p'), dragOverEvent);
    expect(container.querySelector('p').className).toContain('drag-bottom');
    expect(container.querySelector('p').className).toContain('drag-enter');
    fireEvent.drop(container.querySelector('p'), {
      dataTransfer: {
        getData: () => '{}',
      } });
    expect(container.querySelector('p').className).not.toContain('drag-bottom');
    expect(container.querySelector('p').className).not.toContain('drag-enter');
    unmount();
  });

  it('should trigger onDragOver props event when drag over', () => {
    const dragOverMock = jest.fn();
    const { container, unmount } = render(
      <Droppable onDragOver={dragOverMock}><p>hello</p></Droppable>
    );
    fireEvent.dragEnter(container.querySelector('p'));
    const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
    Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
    fireEvent(container.querySelector('p'), dragOverEvent);
    expect(dragOverMock).toHaveBeenCalled();
    unmount();
  });

  it('should trigger onDragLeave props event when drag leave', () => {
    const dragLeaveMock = jest.fn();
    const { container, unmount } = render(
      <Droppable onDragLeave={dragLeaveMock}><p>hello</p></Droppable>
    );
    fireEvent.dragEnter(container.querySelector('p'));
    const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
    Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
    fireEvent(container.querySelector('p'), dragOverEvent);
    expect(container.querySelector('p').className).toContain('drag-bottom');
    fireEvent.dragLeave(container.querySelector('p'));
    expect(container.querySelector('p').className).not.toContain('drag-bottom');
    expect(dragLeaveMock).toHaveBeenCalled();
    unmount();
  });

  it('should trigger onDrop props event when drop', () => {
    const dropMock = jest.fn();
    const { container, unmount } = render(
      <Droppable onDrop={dropMock}><p>hello</p></Droppable>
    );
    fireEvent.dragEnter(container.querySelector('p'));
    const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
    Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });

    fireEvent(container.querySelector('p'), dragOverEvent);
    expect(container.querySelector('p').className).toContain('drag-bottom');
    fireEvent.drop(container.querySelector('p'), {
      dataTransfer: {
        getData: () => '{}',
      } });

    expect(container.querySelector('p').className).not.toContain('drag-bottom');
    expect(dropMock).toHaveBeenCalled();
    unmount();
  });

  describe('when disabled', () => {
    it('should not add drag-enter classname when dragEnter', () => {
      const { container, unmount } = render(
        <Droppable disabled={true}><p>hello</p></Droppable>
      );
      fireEvent.dragEnter(container.querySelector('p'));
      expect(container.querySelector('p').className)
        .not.toContain('drag-enter');
      unmount();
    });

    it('should not add drag-top event on dragOver if element is on top', () => {
      const { container, unmount } = render(
        <Droppable disabled={true}><p>hello</p></Droppable>
      );
      fireEvent.dragEnter(container.querySelector('p'));
      const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
      Object.defineProperty(dragOverEvent, 'clientY', { value: -1 });
      fireEvent(container.querySelector('p'), dragOverEvent);
      expect(container.querySelector('p').className)
        .not.toContain('drag-top');
      unmount();
    });

    it('should not add drag-bottom event on dragOver' +
      ' if element is on bottom', () => {
      const { container, unmount } = render(
        <Droppable disabled={true}><p>hello</p></Droppable>
      );
      fireEvent.dragEnter(container.querySelector('p'));
      const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
      Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
      fireEvent(container.querySelector('p'), dragOverEvent);
      expect(container.querySelector('p').className)
        .not.toContain('drag-bottom');
      unmount();
    });

    it('should not trigger onDragOver props event when drag over', () => {
      const dragOverMock = jest.fn();
      const { container, unmount } = render(
        <Droppable disabled={true} onDragOver={dragOverMock}>
          <p>hello</p>
        </Droppable>
      );
      fireEvent.dragEnter(container.querySelector('p'));
      const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
      Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
      expect(dragOverMock).not.toHaveBeenCalled();
      unmount();
    });

    it('should not trigger onDrop props event when drop', () => {
      const dropMock = jest.fn();
      const { container, unmount } = render(
        <Droppable disabled={true} onDrop={dropMock}><p>hello</p></Droppable>
      );
      fireEvent.dragEnter(container.querySelector('p'));
      const dragOverEvent = createEvent.dragOver(container.querySelector('p'));
      Object.defineProperty(dragOverEvent, 'clientY', { value: 1 });
      fireEvent(container.querySelector('p'), dragOverEvent);
      fireEvent.drop(container.querySelector('p'), {
        dataTransfer: {
          getData: () => '{}',
        } });
      expect(dropMock).not.toHaveBeenCalled();
      unmount();
    });
  });
});
