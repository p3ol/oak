import { render } from '@testing-library/react';
import Icon from '.';

describe('<Icon />', () => {
  it('should render', () => {
    const { container, unmount } = render(
      <Icon>
        <span>Hello</span>
      </Icon>
    );
    expect(container.querySelector('.oak-icons')).toBeTruthy();
    unmount();
  });

  it('should add custom className to icon div', () => {
    const { container, unmount } = render(
      <Icon className="custom">
        <span>Hello</span>
      </Icon>
    );
    expect(container.querySelector('.custom')).toBeTruthy();
    unmount();
  });

  it('should add inner element inside icon', () => {
    const { container, unmount } = render(
      <Icon className="custom">
        <span id="inside">Hello</span>
      </Icon>
    );
    expect(container.querySelector('#inside')).toBeTruthy();
    unmount();
  });
});
