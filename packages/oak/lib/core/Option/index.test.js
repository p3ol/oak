import { fireEvent, render } from '@testing-library/react';

import Option from '.';

describe('<Option />', () => {
  it('should render', () => {
    const { container } = render(
      <Option />
    );
    expect(container.querySelector('.oak-option')).toBeTruthy();
  });

  it('should add custom className to option icon', () => {
    const { container } = render(
      <Option
        className="custom"
      />
    );
    expect(container.querySelector('.custom')).toBeTruthy();
  });

  it('should set custom icon to option icon', () => {
    const { container } = render(
      <Option
        option={{ icon: 'custom' }}
      />
    );
    expect(container.querySelector('.oak-icons').innerHTML).toEqual('custom');
  });

  it('should trigger custom event on custom handler', () => {
    const customClickMock = jest.fn();
    const { container } = render(
      <Option
        option={{ icon: 'custom' }}
        onClick={customClickMock}
      />
    );
    fireEvent.click(container.querySelector('.oak-option'));
    expect(customClickMock).toHaveBeenCalled();
  });
});
