import { render, waitFor, cleanup, fireEvent } from '@testing-library/react';

import { withBuilder } from '@tests-utils';
import Row from '.';

describe('<Row />', () => {
  it('should render', () => {
    const { container } = render(
      <Row
        element={{
          cols: [],
        }}
      />
    );
    expect(container.querySelector('.oak-row-content')).toBeTruthy();
  });

  it('should render as many cols as specified', () => {
    const { container } = render(
      <Row
        element={{
          cols: [
            { content: [] },
            { content: [] },
            { content: [] },
            { content: [] },
          ],
        }}
      />
    );
    expect(container.querySelectorAll('.oak-col').length).toBe(4);
  });

  it('should add custom element style to element', () => {
    const { container } = render(
      <Row
        className="custom-class"
        element={{
          cols: [],
          style: { backgroundColor: 'red' },
        }}
      />
    );
    expect(container.querySelector('.custom-class')).toBeTruthy();
    expect(container.querySelector('.custom-class').getAttribute('style'))
      .toContain('background-color: red');
  });

  it('should add correct flex direction className', () => {
    const { container } = render(
      <Row
        element={{
          cols: [],
          settings: {
            flexDirection: 'mock-direction',
          },
        }}
      />
    );
    expect(container.querySelector('.oak-direction-mock-direction'))
      .toBeTruthy();
  });

  it('should add correct align items className', () => {
    const { container } = render(
      <Row
        element={{
          cols: [],
          settings: {
            alignItems: 'mock-align',
          },
        }}
      />
    );
    expect(container.querySelector('.oak-align-mock-align'))
      .toBeTruthy();
  });

  it('should add correct justify content className', () => {
    const { container } = render(
      <Row
        element={{
          cols: [],
          settings: {
            justifyContent: 'mock-justify',
          },
        }}
      />
    );
    expect(container.querySelector('.oak-justify-mock-justify'))
      .toBeTruthy();
  });

  it('should splice element cols when removing a col', async () => {
    const mockSetElement = jest.fn();
    const { container } = render(withBuilder((
      <Row
        element={{
          cols: [
            { content: [] },
            { content: [] },
            { content: [] },
            { content: [] },
          ],
        }}
      />
    ), { setElement: mockSetElement }));
    const colsAfter = [
      { content: [] },
      { content: [] },
      { content: [] },
    ];
    fireEvent.click(container.querySelectorAll('.oak-remove')[1]);
    await waitFor(() => expect(mockSetElement).toHaveBeenCalledWith({
      cols: colsAfter,
    }, {
      cols: colsAfter,
    }));
  });

  it('should remove the correct col', async () => {
    const mockSetElement = jest.fn();

    const { container, rerender } = render(withBuilder((
      <Row
        element={{
          cols: [
            { content: [], id: '1' },
            { content: [], id: '2' },
            { content: [], id: '3' },
            { content: [], id: '4' },
          ],
        }}
      />
    ), { setElement: mockSetElement }));
    let colsAfter = [
      { content: [], id: '2' },
      { content: [], id: '3' },
      { content: [], id: '4' },
    ];

    //remove first col
    fireEvent.click(container.querySelectorAll('.oak-remove')[0]);
    await waitFor(() => expect(mockSetElement).toHaveBeenCalledWith({
      cols: colsAfter,
    }, {
      cols: colsAfter,
    }));

    //remove second col
    rerender(withBuilder(<Row
      element={{
        cols: [
          { content: [], id: '1' },
          { content: [], id: '2' },
          { content: [], id: '3' },
          { content: [], id: '4' },
        ],
      }}
    />
    , { setElement: mockSetElement }));

    colsAfter = [
      { content: [], id: '1' },
      { content: [], id: '3' },
      { content: [], id: '4' },
    ];

    fireEvent.click(container.querySelectorAll('.oak-remove')[1]);
    await waitFor(() => expect(mockSetElement).toHaveBeenCalledWith({
      cols: colsAfter,
    }, {
      cols: colsAfter,
    }));

    // remove third col
    rerender(withBuilder(<Row
      element={{
        cols: [
          { content: [], id: '1' },
          { content: [], id: '2' },
          { content: [], id: '3' },
          { content: [], id: '4' },
        ],
      }}
    />
    , { setElement: mockSetElement }));

    colsAfter = [
      { content: [], id: '1' },
      { content: [], id: '2' },
      { content: [], id: '4' },
    ];

    fireEvent.click(container.querySelectorAll('.oak-remove')[2]);
    await waitFor(() => expect(mockSetElement).toHaveBeenCalledWith({
      cols: colsAfter,
    }, {
      cols: colsAfter,
    }));

    // remove last col
    rerender(withBuilder((
      <Row
        element={{
          cols: [
            { content: [], id: '1' },
            { content: [], id: '2' },
            { content: [], id: '3' },
            { content: [], id: '4' },
          ],
        }}
      />
    ), { setElement: mockSetElement }));

    colsAfter = [
      { content: [], id: '1' },
      { content: [], id: '2' },
      { content: [], id: '3' },
    ];

    fireEvent.click(container.querySelectorAll('.oak-remove')[3]);
    await waitFor(() => expect(mockSetElement).toHaveBeenCalledWith({
      cols: colsAfter,
    }, {
      cols: colsAfter,
    }));
  });

  it('should add col on divide', async () => {
    const mockSetElement = jest.fn();
    const { container } = render(withBuilder((
      <Row
        element={{
          cols: [
            { content: [] },
            { content: [] },
            { content: [] },
            { content: [] },
          ],
        }}
      />
    ), { setElement: mockSetElement }));

    fireEvent.click(container.querySelector('.oak-divider>a'));
    await waitFor(() => expect(mockSetElement).toHaveBeenCalled());
  });

  it('should add col before selected col if ' +
    'left button is clicked', async () => {
    const mockSetElement = jest.fn();
    const { container } = render(withBuilder((
      <Row
        element={{
          cols: [
            { content: [], id: '1' },
            { content: [], id: '2' },
            { content: [], id: '3' },
            { content: [], id: '4' },
          ],
        }}
      />
    ), { setElement: mockSetElement }));
    const colsAfter = [
      expect.objectContaining({
        type: 'col',
        style: {},
      }),
      { content: [], id: '1' },
      { content: [], id: '2' },
      { content: [], id: '3' },
      { content: [], id: '4' },
    ];
    fireEvent.click(container.querySelectorAll('.oak-divider>a')[0]);
    await waitFor(() => expect(mockSetElement).toHaveBeenCalledWith({
      cols: colsAfter,
    }, {
      cols: colsAfter,
    }));
  });

  it('should add col after selected col if ' +
    'right button is clicked', async () => {
    const mockSetElement = jest.fn();
    const { container } = render(withBuilder((
      <Row
        element={{
          cols: [
            { content: [], id: '1' },
            { content: [], id: '2' },
            { content: [], id: '3' },
            { content: [], id: '4' },
          ],
        }}
      />
    ), { setElement: mockSetElement }));
    const colsAfter = [
      { content: [], id: '1' },
      expect.objectContaining({
        type: 'col',
        style: {},
      }),
      { content: [], id: '2' },
      { content: [], id: '3' },
      { content: [], id: '4' },

    ];
    fireEvent.click(container.querySelectorAll('.oak-divider>a')[1]);
    await waitFor(() => expect(mockSetElement).toHaveBeenCalledWith({
      cols: colsAfter,
    }, {
      cols: colsAfter,
    }));
  });

  afterEach(() => {
    cleanup();
  });
});
