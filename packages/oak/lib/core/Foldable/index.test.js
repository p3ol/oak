import { render, waitFor } from '@testing-library/react';
import { withBuilder } from '@tests-utils';
import Foldable from '.';
import { COMPONENT_ROW } from '../../components';

describe('<Foldable />', () => {
  it('should render', () => {
    const { container } = render(withBuilder(
      <Foldable
        element={{
          type: 'foldable',
          content: {
            type: 'row',
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
          seeMore: {
            type: 'row',
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
          seeLess: {
            type: 'row',
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
        }}
      />,
      { getComponent: jest.fn().mockReturnValue(COMPONENT_ROW) }
    ));
    expect(container.querySelector('.oak-foldable-content')).toBeTruthy();
  });

  it('should display as many cols as defined in ' +
  'content, see more and see less sections', () => {
    const { container } = render(withBuilder(
      <Foldable
        element={{
          content: {
            type: 'row',
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
          seeMore: {
            cols: [
              { content: [] },
              { content: [] },
            ],
          },
          seeLess: {
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
        }}
      />,
      { getComponent: jest.fn().mockReturnValue(COMPONENT_ROW) }
    ));

    const content = container.querySelectorAll('.oak-foldable-content')[0];
    const seeMore = container.querySelector('.oak-foldable-see-more');
    const seeLess = container.querySelector('.oak-foldable-see-less');

    expect(content.querySelectorAll('.oak-col').length).toEqual(4);
    expect(seeMore.querySelectorAll('.oak-col').length).toEqual(2);
    expect(seeLess.querySelectorAll('.oak-col').length).toEqual(3);
  });

  it('should not show the duplicate button sub row', () => {
    const { container } = render(withBuilder(
      <Foldable
        element={{
          content: {
            type: 'row',
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
          seeMore: {
            cols: [
              { content: [] },
              { content: [] },
            ],
          },
          seeLess: {
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
        }}
      />,
      { getComponent: jest.fn().mockReturnValue(COMPONENT_ROW) }
    ));

    const contentOptions = container.querySelector(
      '.oak-foldable-content>.oak-row>.oak-options'
    );
    expect(contentOptions).toBeTruthy();
    expect(contentOptions.querySelector('.oak-duplicate')).toBeNull();
  });

  it('should not show the drag option on sub row', () => {
    const { container } = render(withBuilder(
      <Foldable
        element={{
          content: {
            type: 'row',
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
          seeMore: {
            cols: [
              { content: [] },
              { content: [] },
            ],
          },
          seeLess: {
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
        }}
      />,
      { getComponent: jest.fn().mockReturnValue(COMPONENT_ROW) }
    ));

    const contentOptions = container.querySelector(
      '.oak-foldable-content>.oak-row>.oak-options'
    );
    expect(contentOptions).toBeTruthy();
    expect(contentOptions.querySelector('.oak-drag-handle')).toBeNull();
  });

  it('should not render the drop zones on subrow', () => {
    const { container } = render(withBuilder(
      <Foldable
        element={{
          content: {
            type: 'row',
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
          seeMore: {
            cols: [
              { content: [] },
              { content: [] },
            ],
          },
          seeLess: {
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
        }}
      />,
      { getComponent: jest.fn().mockReturnValue(COMPONENT_ROW) }
    ));

    const beforeDropZone = container.querySelector(
      '.oak-row-content .oakdrop-zone.oak-before'
    );
    const afterDropZone = container.querySelector(
      '.oak-row-content .oakdrop-zone.oak-after'
    );
    expect(container.querySelector('.oak-row-content')).toBeTruthy();
    expect(beforeDropZone).toBeNull();
    expect(afterDropZone).toBeNull();
  });

  it('should not display the delete option on subrow', () => {
    const { container } = render(withBuilder(
      <Foldable
        element={{
          content: {
            type: 'row',
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
          seeMore: {
            cols: [
              { content: [] },
              { content: [] },
            ],
          },
          seeLess: {
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
        }}
      />,
      { getComponent: jest.fn().mockReturnValue(COMPONENT_ROW) }
    ));

    const contentOptions = container.querySelector(
      '.oak-foldable-content>.oak-row>.oak-options'
    );
    expect(contentOptions).toBeTruthy();
    expect(contentOptions.querySelector('.oak-remove')).toBeNull();
  });

  it('should not be able to delete the last col of sub row', async () => {
    const mockSetElement = jest.fn().mockReturnValue({ content: [] });
    const { container } = render(withBuilder(
      <Foldable
        element={{
          content: {
            type: 'row',
            cols: [
              { content: [] },
              { content: [] },
            ],
          },
          seeMore: {
            cols: [
              { content: [] },
              { content: [] },
            ],
          },
          seeLess: {
            cols: [
              { content: [] },
              { content: [] },
              { content: [] },
            ],
          },
        }}
      />,
      {
        getComponent: jest.fn().mockReturnValue(COMPONENT_ROW),
        setElement: mockSetElement,
      }
    ));
    const content = container.querySelectorAll('.oak-foldable-content')[0];
    content.querySelectorAll('.oak-remove')[1].click();
    await waitFor(() => expect(mockSetElement).toHaveBeenCalledTimes(1));

    content.querySelectorAll('.oak-remove')[1].click();
    await jest.runAllTicks();
    expect(mockSetElement).toHaveBeenCalledTimes(1);
  });
});
