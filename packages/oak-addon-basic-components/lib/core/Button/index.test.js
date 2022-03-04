import { render } from '@testing-library/react';

import Button from '.';
import { builderSpies } from '@mocks/@poool/oak';

describe('<Button />', () => {
  it('should render', () => {
    const { container } = render(
      <Button
        element={{
          content: '<p>Hello world</p>',
        }}
      />
    );
    expect(container.innerHTML).toContain('<p>Hello world</p>');
  });

  it('should sanitize content correctly if it has to', () => {
    const { container } = render(
      <Button
        element={{
          content: '<style>background-color: red</style><p>Hello world</p>',
        }}
      />
    );
    expect(container.innerHTML).toEqual('<div><p>Hello world</p></div>');
  });

  it('should use overrides render if it exists', () => {
    const mockRenderOverrides = jest.fn().mockReturnValue('overrides');
    builderSpies.getOverrides.mockReturnValue({ render: mockRenderOverrides });
    const { container } = render(
      <Button
        element={{
          content: '<p>Hello world</p>',
        }}
      />
    );
    expect(mockRenderOverrides).toHaveBeenCalledWith(expect.objectContaining({
      content: '<p>Hello world</p>',
    }));

    expect(container.innerHTML).toContain('overrides');
  });

  it('should not sanitize HTML when its overrides render', () => {
    const mockRenderOverrides = jest.fn().mockReturnValue(
      '<style>background-color: red</style><p>Hello world</p>'
    );
    builderSpies.getOverrides.mockReturnValue({ render: mockRenderOverrides });
    const { container } = render(
      <Button
        element={{
          content: '<p>Hello world</p>',
        }}
      />
    );
    expect(mockRenderOverrides).toHaveBeenCalledWith(expect.objectContaining({
      content: '<p>Hello world</p>',
    }));

    expect(container.innerHTML).toContain('background-color: red');
  });

  afterEach(() => {
    builderSpies.reset();
  });
});
