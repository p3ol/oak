import { useRef } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { withBuilder } from '@tests-utils';
import Editable from '.';

describe('<Editable />', () => {
  const ComplexElement = ({
    component = { settings: {} },
    element = { type: {} },
  }) => {
    const containerRef = useRef();

    const openMenu = () => {
      containerRef.current?.toggle();
    };

    const closeMenu = () => {
      containerRef.current?.close();
    };

    const toggleMenu = () => {
      containerRef.current?.toggle();
    };

    return (
      <Editable
        component={component}
        element={element}
        ref={containerRef}
      >
        <div>
          <button onClick={openMenu} id="open" />
          <button onClick={closeMenu} id="close" />
          <button onClick={toggleMenu} id="toggle" />
        </div>
      </Editable>
    );
  };

  it('should render', () => {
    const { container, unmount } = render(<Editable><p>hello</p></Editable>);
    expect(container.innerHTML).toContain('hello');
    unmount();
  });

  it('should open menu when clicked', async () => {
    const { container, unmount } = render(withBuilder(
      <ComplexElement />, { getOverrides: () => jest.fn() }
    ));
    expect(container.querySelector('.oak-opened')).toBeNull();
    fireEvent.click(container.querySelector('#open'));
    await waitFor(() => {
      expect(container.querySelector('.oak-opened')).toBeTruthy();
    });
    unmount();
  });

  it('should close menu when close button is clicked', async () => {
    const { container, queryByText, unmount } = render(withBuilder(
      <ComplexElement />, { getOverrides: () => jest.fn() }
    ));
    expect(container.querySelector('.oak-opened')).toBeNull();
    fireEvent.click(container.querySelector('#open'));
    await waitFor(() => {
      expect(container.querySelector('.oak-opened')).toBeTruthy();
      expect(queryByText('Element options')).toBeTruthy();
    });
    fireEvent.click(container.querySelector('#close'));
    await waitFor(() => (
      expect(container.querySelector('.oak-opened')).toBeFalsy()
    ));
    unmount();
  });

  it('should open and close alternatively ' +
  'when toggle button is clicked', async () => {
    const { container, queryByText, unmount } = render(withBuilder(
      <ComplexElement />, { getOverrides: () => jest.fn() }
    ));
    expect(container.querySelector('.oak-opened')).toBeNull();
    fireEvent.click(container.querySelector('#toggle'));
    await waitFor(() =>
      expect(queryByText('Element options')).toBeTruthy()
    );
    fireEvent.click(container.querySelector('#toggle'));
    await waitFor(() => {
      expect(container.querySelector('.oak-opened')).toBeFalsy();
      expect(queryByText('Element options')).toBeFalsy();
    });
    unmount();
  });

  it('should display form from component settings', async () => {
    const { container, getByText, unmount } = render(withBuilder((
      <ComplexElement
        component={{
          settings: {
            title: 'test',
            fields: [{
              label: 'field title',
              type: 'select',
              key: 'settings.key',
              options: [{}],
            }],
          },
        }}
      />
    ), { getOverrides: () => jest.fn() }));
    fireEvent.click(container.querySelector('#toggle'));
    await waitFor(() => {
      expect(getByText('field title')).toBeTruthy();
      expect(container.querySelector('.oak-opened')).toBeTruthy();
    });
    expect(getByText('field title')).toBeTruthy();
    unmount();
  });

  it('should close form on cancel', async () => {
    const { container, getByText, unmount } = render(withBuilder((
      <ComplexElement
        component={{
          settings: {
            title: 'test',
            fields: [{
              label: 'field title',
              type: 'select',
              key: 'settings.key',
              options: [{}],
            }],
          },
        }}
      />
    ), { getOverrides: () => jest.fn() }));
    fireEvent.click(container.querySelector('#toggle'));
    await waitFor(() => (
      expect(container.querySelector('.oak-opened')).toBeTruthy()
    ));
    expect(getByText('test')).toBeTruthy();
    fireEvent.click(container
      .querySelector('.oak-editable-buttons>.button:first-child'));
    await waitFor(() => (
      expect(container.querySelector('.oak-opened')).toBeFalsy()
    ));
    unmount();
  });

  it('should close form on save', async () => {
    const { container, getByText, unmount } = render(withBuilder((
      <ComplexElement
        component={{
          settings: {
            title: 'test',
            fields: [{
              label: 'field title',
              type: 'select',
              key: 'settings.key',
              options: [{}],
            }],
          },
        }}
      />
    ), { getOverrides: () => jest.fn(), setElement: () => jest.fn() }));
    fireEvent.click(container.querySelector('#toggle'));
    await waitFor(() => (
      expect(getByText('field title')).toBeTruthy()
    ));
    fireEvent.click(container.querySelector('.oak-editable-buttons>button'));
    await waitFor(() => (
      expect(container.querySelector('.oak-opened')).toBeFalsy()
    ));
    unmount();
  });
});
