import { fireEvent, render, waitFor } from '@testing-library/react';

import CoreImageField from './index';

describe('CoreImageComponent', () => {

  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(document, 'createElement')
      .mockRestore();
    jest.spyOn(document, 'appendChild')
      .mockRestore();
  });

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

  it('should display content and remove button if' +
  ' an image is selected', async () => {
    const newFile = new File([''], 'test.jpeg', { type: 'image/jpeg' });
    const { container, debug } = render(<CoreImageField />);
    const input = document.createElement('input');
    jest.spyOn(input, 'click').mockImplementationOnce(() => {
      console.log('coucou');

    });
    jest.spyOn(document, 'createElement')
      .mockImplementation(() => {
        console.log('mocked');

        return input;
      });
    expect(container.querySelector('.oak-core-image-field .oak-icons'))
      .toBeTruthy();
    expect(
      container.querySelector('.oak-core-image-field .oak-icons').innerHTML
    ).toEqual('add');

    fireEvent.click(container.querySelector('.oak-core-image-field'));
    fireEvent.change(input, { target: { files: [newFile] } });
    debug();
    await waitFor(() => expect(
      container.querySelector('.oak-remove')).toBeTruthy()
    );
  });
});
