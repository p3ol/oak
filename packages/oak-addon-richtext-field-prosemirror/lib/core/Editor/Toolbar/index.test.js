import { fireEvent, render, waitFor } from '@testing-library/react';

import Toolbar from '.';
import { schema } from '../schema';
import * as utils from '../utils';

describe('<Toolbar />', () => {
  beforeEach(() => {
    jest.spyOn(utils, 'getActiveAttrs').mockReturnValue({});
    jest.spyOn(utils, 'getAlignment').mockReturnValue(null);
    jest.spyOn(utils, 'isMarkActive').mockReturnValue(false);
  });

  it('should render', async () => {
    const { container } = render(
      <Toolbar
        onToggleMark={() => jest.fn()}
        onToggleBlock={() => jest.fn()}
        onToggleLink={() => jest.fn()}
        state={{}}
      />
    );
    expect(true).toBeTruthy();
    await waitFor(
      () => expect(container.querySelector('.oak-toolbar')).toBeTruthy()
    );
  });

  it('should trigger onToggleBlock if blockButton is clicked', async () => {
    const onToggleBlockMock = jest.fn();
    const { getByText } = render(
      <Toolbar
        onToggleMark={() => jest.fn()}
        onToggleBlock={onToggleBlockMock}
        onToggleLink={() => jest.fn()}
        state={{}}
      />
    );
    fireEvent.click(getByText('format_align_center'));
    await waitFor(() => expect(onToggleBlockMock).toHaveBeenCalled());
  });

  it('should trigger onToggleMark if markButton is clicked', async () => {
    const onToggleMarkMock = jest.fn();
    const { getByText } = render(
      <Toolbar
        onToggleMark={onToggleMarkMock}
        onToggleBlock={() => jest.fn()}
        onToggleLink={() => jest.fn()}
        state={{}}
      />
    );
    fireEvent.click(getByText('format_underlined'));
    await waitFor(() => expect(onToggleMarkMock).toHaveBeenCalled());
  });

  it('should trigger onToggleLink if link change', async () => {
    const onToggleLinkMock = jest.fn();
    const { getByText, container } = render(
      <Toolbar
        onToggleMark={() => jest.fn()}
        onToggleBlock={() => jest.fn()}
        onToggleLink={onToggleLinkMock}
        state={{}}
      />
    );
    fireEvent.click(getByText('link'));
    fireEvent.change(
      container.querySelector('.oak-link-url input'),
      { target: { value: 'http://example.com' } }
    );
    await waitFor(() => expect(onToggleLinkMock).toHaveBeenCalledWith({
      href: 'http://example.com',
    }));
  });

  it('should display the right size', async () => {
    utils.getActiveAttrs.mockReturnValue({ size: '17px' });

    const { container } = render(
      <Toolbar
        onToggleMark={() => jest.fn()}
        onToggleBlock={() => jest.fn()}
        onToggleLink={() => jest.fn()}
        state={{}}
      />
    );
    await waitFor(() => expect(
      container.querySelector('.oak-text-size').textContent
    ).toEqual('17'));
  });

  it('should decrease size when clicking on "-" button', async () => {
    utils.getActiveAttrs.mockReturnValue({ size: '17px' });
    const onToggleMarkMock = jest.fn();
    const { container, getByText } = render(
      <Toolbar
        onToggleMark={ onToggleMarkMock }
        onToggleBlock={() => jest.fn()}
        onToggleLink={() => jest.fn()}
        state={{}}
      />
    );
    await waitFor(() => expect(
      container.querySelector('.oak-text-size').textContent
    ).toEqual('17'));
    fireEvent.click(getByText('horizontal_rule'));
    expect(onToggleMarkMock)
      .toHaveBeenCalledWith(schema.marks.size, { size: '16px' });
  });

  it('should increase size when clicking on "+" button', async () => {
    utils.getActiveAttrs.mockReturnValue({ size: '17px' });
    const onToggleMarkMock = jest.fn();
    const { container, getByText } = render(
      <Toolbar
        onToggleMark={ onToggleMarkMock }
        onToggleBlock={() => jest.fn()}
        onToggleLink={() => jest.fn()}
        state={{}}
      />
    );
    await waitFor(() => expect(
      container.querySelector('.oak-text-size').textContent
    ).toEqual('17'));
    fireEvent.click(getByText('add'));
    expect(onToggleMarkMock)
      .toHaveBeenCalledWith(schema.marks.size, { size: '18px' });
  });

  it('should set active mode on a markButton if mark is active', async () => {
    utils.isMarkActive.mockReturnValue(true);

    const { container } = render(
      <Toolbar
        onToggleMark={ () => jest.fn() }
        onToggleBlock={() => jest.fn()}
        onToggleLink={() => jest.fn()}
        state={{}}
      />
    );
    await waitFor(
      () => expect(container.querySelector('.oak-underline.oak-active'))
        .toBeTruthy()
    );
  });

  it('should set active mode on a alignment ' +
  'if alignment is active', async () => {
    utils.getAlignment.mockReturnValue('left');

    const { container } = render(
      <Toolbar
        onToggleMark={ () => jest.fn() }
        onToggleBlock={() => jest.fn()}
        onToggleLink={() => jest.fn()}
        state={{}}
      />
    );
    await waitFor(
      () => expect(container.querySelector('.oak-text-left.oak-active'))
        .toBeTruthy()
    );
  });

  it('should trigger toggleMark with new color if ' +
  'color has changed', async () => {
    const onToggleMarkMock = jest.fn();
    const { container, getByText } = render(
      <Toolbar
        onToggleMark={ onToggleMarkMock }
        onToggleBlock={() => jest.fn()}
        onToggleLink={() => jest.fn()}
        state={{}}
      />
    );
    fireEvent.click(getByText('format_color_text'));
    fireEvent.change(
      container.querySelector('.color-input input'),
      { target: { value: '#ff0000' } }
    );
    await waitFor(
      () => expect(onToggleMarkMock)
        .toHaveBeenCalledWith(schema.marks.color, { color: '#ff0000' })
    );
  });
});
