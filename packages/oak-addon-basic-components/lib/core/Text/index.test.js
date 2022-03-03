import { render } from '@testing-library/react';

import { builderSpies } from '@mocks/@poool/oak';
import Text from '.';

describe('<Text />', () => {
  it('should render', () => {
    const { container } = render(
      <Text
        element={{
          content: '<p>Hello world</p>',
        }}
      />
    );

    expect(container.innerHTML).toContain('Hello world');
  });

  it('should sanitize given string', () => {
    const { container } = render(
      <Text
        element={{
          content: '<style>background-color: red</style><p>Hello world</p>',
        }}
      />
    );

    expect(container.innerHTML).not.toContain('background-color: red');
  });

  it('should use overrides renderer if its given', () => {
    const mockRenderOverrides = jest.fn().mockReturnValue('<p>overrides</p>');
    builderSpies.getOverrides.mockReturnValue({ render: mockRenderOverrides });

    const { container } = render(
      <Text
        element={{
          content: '<p>Hello world</p>',
        }}
      />
    );

    expect(container.innerHTML).toContain('overrides');
  });

  it('should use custom className if its passed as props', () => {
    const { container } = render(
      <Text
        element={{
          content: '<p>Hello world</p>',
        }}
        className="custom-class"
      />
    );

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  afterEach(() => {
    builderSpies.reset();
  });
});
