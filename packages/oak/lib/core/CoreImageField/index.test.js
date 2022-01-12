import { fireEvent, render, waitFor } from '@testing-library/react';

import CoreImageField from './index';

describe('CoreImageComponent', () => {

  it('should render component', () => {
    const { container } = render(<CoreImageField />);
    expect(container.querySelector('.oak-core-image-field')).toBeTruthy();
  });

  it('should display empty image field', () => {
    const { container } = render(<CoreImageField />);
    expect(container.querySelector('.oak-core-image-field .oak-icons'))
      .toBeTruthy();
    expect(
      container.querySelector('.oak-core-image-field .oak-icons').innerHTML
    ).toEqual('add');
  });

  it('should display content and remove button if image is filled', () => {
    const { container } = render(<CoreImageField value="test" />);
    expect(container.querySelector('.oak-core-image-field .oak-icons'))
      .toBeTruthy();

    expect(
      container.querySelector('.oak-core-image-field .oak-icons').innerHTML
    ).toEqual('close');
    expect(container.querySelector('.oak-remove')).toBeTruthy();
    expect(
      container.querySelector('.oak-core-image-field').getAttribute('style')
    ).toContain('background-image: url(test);');
  });
});
