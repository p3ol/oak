import { render } from '@testing-library/react';

import { withBuilder } from '@tests-utils';
import Text from '.';

describe('<Text />', () => {
  it('should render', () => {
    const { container } = render(withBuilder(<Text>Hello</Text>));
    expect(container.innerHTML).toContain('Hello');
  });

  it('should use custom hangler if its provided', () => {
    const mockHandler = jest.fn().mockReturnValue('custom handler');
    const { container } = render(withBuilder(
      <Text name={mockHandler} />
    ));
    expect(mockHandler).toHaveBeenCalled();
    expect(container.innerHTML).toContain('custom handler');
  });

  it('should name props in priority', () => {
    const mockHandler = jest.fn();
    render(withBuilder((
      <Text name="name props">children props</Text>
    ), { getText: mockHandler }));
    expect(mockHandler).toHaveBeenCalledWith('name props', 'name props');
  });

  it('should use default propsfor second args in priority', () => {
    const mockHandler = jest.fn();
    render(withBuilder((
      <Text name="name props" default="default props">children props</Text>
    ), { getText: mockHandler }));
    expect(mockHandler).toHaveBeenCalledWith('name props', 'default props');
  });

  it('should use default if no getText function is provided', () => {
    const { container } = render(
      <Text default="default props">children props</Text>
    );
    expect(container.innerHTML).toContain('default props');
  });
});
