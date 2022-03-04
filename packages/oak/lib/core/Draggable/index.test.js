import { fireEvent, render, waitFor } from '@testing-library/react';

import Draggable from './index';

describe('<Draggable />', () => {
  it('should render', () => {
    const { container } = render(<Draggable><p>hello</p></Draggable>);
    expect(container.innerHTML).toContain('hello');
  });

  it('should add dragging className when dragStart', () => {
    const { container } = render(<Draggable><p>hello</p></Draggable>);
    fireEvent.dragStart(container.querySelector('p'));
    expect(container.querySelector('p').className).toContain('dragging');
  });

  it('should add dragged classname right after drag has begun', async () => {
    const { container } = render(<Draggable><p>hello</p></Draggable>);
    fireEvent.dragStart(container.querySelector('p'));
    expect(container.querySelector('p').className).toContain('dragging');
    await waitFor(() => (
      expect(container.querySelector('p').className).toContain('dragged') &&
      expect(container.querySelector('p').className).not.toContain('dragging')
    ));
  });

  it('should remove draggedClassname when drag is Over', async () => {
    const { container } = render(<Draggable><p>hello</p></Draggable>);
    fireEvent.dragStart(container.querySelector('p'));
    expect(container.querySelector('p').className).toContain('dragging');
    await waitFor(() => (
      expect(container.querySelector('p').className).toContain('dragged') &&
      expect(container.querySelector('p').className).not.toContain('dragging')
    ));
    fireEvent.dragEnd(container.querySelector('p'));
    expect(container.querySelector('p').className).not.toContain('dragged');
  });

  it('should trigger onDragStart props when drag start', () => {
    const onDragStartMock = jest.fn();
    const { container } = render(
      <Draggable onDragStart={onDragStartMock}><p>hello</p></Draggable>
    );

    fireEvent.dragStart(container.querySelector('p'));
    expect(onDragStartMock).toHaveBeenCalled();
  });

  it('should trigger onDragEnd props when drag end', async () => {
    const onDragEndMock = jest.fn();
    const { container } = render(
      <Draggable onDragEnd={onDragEndMock}><p>hello</p></Draggable>
    );
    fireEvent.dragStart(container.querySelector('p'));
    await waitFor(() => (
      expect(container.querySelector('p').className).toContain('dragged') &&
      expect(container.querySelector('p').className).not.toContain('dragging')
    ));
    fireEvent.dragEnd(container.querySelector('p'));
    expect(onDragEndMock).toHaveBeenCalled();
  });

  it('should trigger dragEvent on drag', () => {
    const onDragMock = jest.fn();
    const { container } = render(
      <Draggable onDrag={onDragMock}><p>hello</p></Draggable>
    );
    fireEvent.drag(container.querySelector('p'));
    expect(onDragMock).toHaveBeenCalled();
  });

  describe('when disabled', () => {
    it('should not add dragging className when dragStart', () => {
      const { container } = render(
        <Draggable disabled={true}><p>hello</p></Draggable>
      );
      fireEvent.dragStart(container.querySelector('p'));
      expect(container.querySelector('p').className).not.toContain('dragging');
    });

    it('should not trigger onDragStart props when drag start', () => {
      const onDragStartMock = jest.fn();
      const { container } = render(
        <Draggable
          disabled={true}
          onDragStart={onDragStartMock}
        >
          <p>hello</p>
        </Draggable>
      );

      fireEvent.dragStart(container.querySelector('p'));
      expect(onDragStartMock).not.toHaveBeenCalled();
    });

    it('should not trigger dragEvent on drag', () => {
      const onDragMock = jest.fn();
      const { container } = render(
        <Draggable disabled={true} onDrag={onDragMock}><p>hello</p></Draggable>
      );
      fireEvent.drag(container.querySelector('p'));
      expect(onDragMock).not.toHaveBeenCalled();
    });
  });
});
