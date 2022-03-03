import { render } from '@testing-library/react';

import Image from '.';

describe('<Image />', () => {
  it('should render', () => {
    const { container } = render(
      <Image element={{ name: 'elt', url: 'https://google.com/image' }} />
    );
    expect(container.querySelector('.oak-image-preview')).toBeTruthy();
  });

  it('should display "local image" if image is local and has no name', () => {
    const { getByText } = render(
      <Image element={{ url: 'data:image/png;base64,iVBORw0KG==' }} />
    );
    expect(getByText('Local image')).toBeTruthy();
  });

  it('should display "no image" if there is no image', () => {
    const { getByText } = render(
      <Image element={{}} />
    );
    expect(getByText('No image')).toBeTruthy();
  });

  it('should set background image with element url if it exists', () => {
    const { container } = render(
      <Image element={{ url: 'https://google.com/image' }} />
    );
    expect(container.querySelector('.oak-image-preview').style.backgroundImage)
      .toEqual('url(https://google.com/image)');
  });

  it('should add custom className', () => {
    const { container } = render(
      <Image
        className="custom-class"
        element={{ url: 'https://google.com/image' }}
      />
    );
    expect(container.querySelector('.custom-class')).toBeTruthy();
  });
});
