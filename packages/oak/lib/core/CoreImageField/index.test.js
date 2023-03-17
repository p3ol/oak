import { render } from '@testing-library/react';

import CoreImageField from './index';

describe('CoreImageComponent', () => {

  it('should render component', () => {
    const { container, unmount } = render(<CoreImageField />);
    expect(container.querySelector('.oak-core-image-field')).toBeTruthy();
    unmount();
  });

  it('should display empty image field', () => {
    const { container, unmount } = render(<CoreImageField />);
    expect(container.querySelector('.oak-core-image-field .oak-icons'))
      .toBeTruthy();
    expect(
      container.querySelector('.oak-core-image-field .oak-icons').innerHTML
    ).toEqual('add');
    unmount();
  });

  it('should display content and remove button if image is filled', () => {
    const { container, unmount } = render(<CoreImageField value="test" />);
    expect(container.querySelector('.oak-core-image-field .oak-icons'))
      .toBeTruthy();

    expect(
      container.querySelector('.oak-core-image-field .oak-icons').innerHTML
    ).toEqual('close');
    expect(container.querySelector('.oak-remove')).toBeTruthy();
    expect(
      container.querySelector('.oak-core-image-field').getAttribute('style')
    ).toContain('background-image: url(test);');
    unmount();
  });
});
