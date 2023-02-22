import { render } from '@testing-library/react';

import { builderSpies } from '@poool/oak';
import Title from '.';

describe('<Text />', () => {
  it('should render', () => {
    const { container } = render(
      <Title
        element={{
          content: '<p>Hello world</p>',
        }}
      />
    );

    expect(container.innerHTML).toContain('Hello world');
  });

  it('should sanitize given string', () => {
    const { container } = render(
      <Title
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
      <Title
        element={{
          content: '<p>Hello world</p>',
        }}
      />
    );

    expect(container.innerHTML).toContain('overrides');
  });

  it('should use custom className if its passed as props', () => {
    const { container } = render(
      <Title
        element={{
          content: '<p>Hello world</p>',
        }}
        className="custom-class"
      />
    );

    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('should set heading tag to h1 by default', () => {
    const { container } = render(
      <Title
        element={{
          content: '<p>Hello world</p>',
          headingLevel: 'h4',
        }}
      />
    );

    expect(container.querySelector('h1')).not.toBeTruthy();
    expect(container.querySelector('h4')).toBeTruthy();
  });

  it('should set custom heading tag if one is passed', () => {
    const { container } = render(
      <Title
        element={{
          content: '<p>Hello world</p>',
        }}
      />
    );

    expect(container.querySelector('h1')).toBeTruthy();
  });

  afterEach(() => {
    builderSpies.reset();
  });
});
