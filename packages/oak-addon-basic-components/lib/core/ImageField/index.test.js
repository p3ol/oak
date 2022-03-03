import { fireEvent, render, waitFor } from '@testing-library/react';
import ImageField from '.';
import { elementSpies, optionsSpies } from '@mocks/@poool/oak';

describe('<ImageField />', () => {

  it('should display touchable zone if there is no image yet', () => {
    const { container } = render(<ImageField />);

    expect(container.querySelector('.oak-image-field-preview'))
      .not.toBeTruthy();

    expect(container.querySelector('.oak-icons')).toBeTruthy();
    expect(container.querySelector('.oak-icons').innerHTML)
      .toEqual('add');
  });

  it('should display if there is image', () => {
    Object.assign(elementSpies, {
      element: { url: 'abababa' },
    });
    const { container } = render(<ImageField />);

    expect(container.querySelector('.oak-image-field-preview')).toBeTruthy();
    expect(container.querySelector('.oak-icons')).not.toBeTruthy();
  });

  it('should display fileName if file is named', () => {
    Object.assign(elementSpies, {
      element: { url: 'abababa', name: 'name.jpg' },
    });
    const { container } = render(<ImageField />);

    expect(container.querySelector('.oak-image-name').innerHTML)
      .toEqual('name.jpg');
  });

  it('should open file dialog and load new image', async () => {
    const newFile = new File(['(⌐□_□)'], 'test.jpeg', { type: 'image/jpeg' });

    jest.spyOn(document, 'createElement')
      .mockRestore();
    jest.spyOn(document, 'appendChild')
      .mockRestore();

    const { container } = render(<ImageField />);

    const input = document.createElement('input');
    jest.spyOn(document, 'createElement')
      .mockImplementationOnce(() => input);
    jest.spyOn(input, 'click').mockImplementation(() => {});

    fireEvent.click(container.querySelector('.oak-icons'));
    fireEvent.change(input, { target: { files: [newFile] } });
    expect(container.querySelector('.oak-image-field-preview'))
      .not.toBeTruthy();
    await waitFor(() =>
      expect(container.querySelector('.oak-image-field-preview')).toBeTruthy()
    );

    expect(container.querySelector('.oak-image-name').innerHTML)
      .toEqual('test.jpeg');
    jest.restoreAllMocks();
  });

  it('should display "local image" if image has no name and its local', () => {
    Object.assign(elementSpies, {
      element: { url: 'data:abababa' },
    });
    const { container } = render(<ImageField />);

    expect(container.querySelector('.oak-image-name').innerHTML)
      .toEqual('Local image');
  });

  it('should use imageUpload strategy if its passed as param', async () => {
    const newFile = new File(['(⌐□_□)'], 'test.jpeg', { type: 'image/jpeg' });
    const onImageUploadMock = jest.fn(
      () => Promise.resolve({
        url: 'http://my-server.com',
        name: 'uploaded123.jpeg',
      })
    );

    jest.spyOn(document, 'createElement')
      .mockRestore();
    jest.spyOn(document, 'appendChild')
      .mockRestore();

    Object.assign(optionsSpies, {
      events: {
        onImageUpload: onImageUploadMock,
      },
    });

    const { container } = render(<ImageField />);

    const input = document.createElement('input');
    jest.spyOn(document, 'createElement')
      .mockImplementationOnce(() => input);
    jest.spyOn(input, 'click').mockImplementation(() => {});

    fireEvent.click(container.querySelector('.oak-icons'));
    fireEvent.change(input, { target: { files: [newFile] } });
    expect(container.querySelector('.oak-image-field-preview'))
      .not.toBeTruthy();
    await waitFor(() =>
      expect(container.querySelector('.oak-image-field-preview')).toBeTruthy()
    );

    expect(container.querySelector('.oak-image-name').innerHTML)
      .toEqual('uploaded123.jpeg');
    expect(onImageUploadMock).toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  it('should reset file if delete button is pressed', async () => {
    Object.assign(elementSpies, {
      element: { url: 'abababa', name: 'name.jpg' },
    });
    const { container, getByText } = render(<ImageField />);

    expect(container.querySelector('.oak-image-name').innerHTML)
      .toEqual('name.jpg');

    fireEvent.click(container.querySelector('.oak-delete'));
    await waitFor(
      () => expect(container.querySelector('.oak-image-field-preview'))
        .not.toBeTruthy()
    );

    expect(getByText('Add image')).toBeTruthy();
  });

  afterEach(() => {
    elementSpies.reset();
    optionsSpies.reset();
  });
});
