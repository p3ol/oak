import { render } from '@testing-library/react';

import { withBuilder } from '@tests-utils';
import Text from '.';

describe('<Text />', () => {
  it('should render', () => {
    const { container, unmount } = render(withBuilder(<Text>Hello</Text>));
    expect(container.innerHTML).toContain('Hello');
    unmount();
  });

  it('should use custom hangler if its provided', () => {
    const mockHandler = jest.fn().mockReturnValue('custom handler');
    const { container, unmount } = render(withBuilder(
      <Text name={mockHandler} />
    ));
    expect(mockHandler).toHaveBeenCalled();
    expect(container.innerHTML).toContain('custom handler');
    unmount();
  });

  it('should name props in priority', () => {
    const mockHandler = jest.fn();
    const { unmount } = render(withBuilder((
      <Text name="name props">children props</Text>
    ), { getText: mockHandler }));
    expect(mockHandler).toHaveBeenCalledWith('name props', 'name props');
    unmount();
  });

  it('should use default propsfor second args in priority', () => {
    const mockHandler = jest.fn();
    const { unmount } = render(withBuilder((
      <Text name="name props" default="default props">children props</Text>
    ), { getText: mockHandler }));
    expect(mockHandler).toHaveBeenCalledWith('name props', 'default props');
    unmount();
  });

  it('should use default if no getText function is provided', () => {
    const { container, unmount } = render(
      <Text default="default props">children props</Text>
    );
    expect(container.innerHTML).toContain('default props');
    unmount();
  });
});
