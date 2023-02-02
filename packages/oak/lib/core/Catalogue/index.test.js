import { fireEvent, render, waitFor } from '@testing-library/react';
import Catalogue from '.';
import { withBuilder } from '@tests-utils';

describe('Catalogue', () => {
  it('should render component', () => {
    const { container, unmount } = render(withBuilder(<Catalogue />, {}));
    expect(container.querySelector('.oak-catalogue')).toBeTruthy();

    unmount();
  });

  it('should open catalog when clicking on "+"', async () => {
    const { container, unmount } = render(<Catalogue />);
    fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => (
      expect(container.querySelector('.oak-popover')).toBeTruthy()
    ));
    unmount();
  });

  it('should display all builder\'s groups', async () => {
    const components = [
      { type: 'group', id: 'group1', name: 'group 1', components: [] },
      { type: 'group', id: 'group2', name: 'group 2', components: [] },
      { type: 'group', id: 'group3', name: 'group 3', components: [] },
      { type: 'group', id: 'group4', name: 'group 4', components: [] },
    ];
    const { container, unmount } = render(withBuilder(<Catalogue />, {
      components,
    }));
    fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => (
      expect(container.querySelector('.oak-popover')).toBeTruthy()
    ));
    expect(container.querySelectorAll('.oak-groups .title').length).toBe(4);
    expect(container.querySelectorAll('.oak-groups .title')[0].textContent)
      .toBe(components[0].name);
    unmount();
  });

  it('should  display "other" groups if ' +
  'other tab is enabled', async () => {
    const components = [
      { type: 'group', id: 'group1', name: 'group 1', components: [] },
      { type: 'group', id: 'group2', name: 'group 2', components: [] },
      { type: 'group', id: 'group3', name: 'group 3', components: [] },
      { type: 'group', id: 'group4', name: 'group 4', components: [] },
      { type: 'group', id: 'other', name: 'Other group', components: [] },
    ];
    const {
      container,
      queryByText,
      unmount,
    } = render(withBuilder(<Catalogue />, {
      options: {
        otherTabEnabled: true,
      },
      components,
    }));
    fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => (
      expect(container.querySelector('.oak-popover')).toBeTruthy()
    ));
    expect(container.querySelectorAll('.oak-groups .title').length).toBe(5);
    expect(container.querySelectorAll('.oak-groups .title')[0].textContent)
      .toBe(components[0].name);
    expect(queryByText('Other group')).toBeTruthy();
    unmount();
  });

  it('should not display "other" groups if ' +
  'other tab is disabled', async () => {
    const components = [
      { type: 'group', id: 'group1', name: 'group 1', components: [] },
      { type: 'group', id: 'group2', name: 'group 2', components: [] },
      { type: 'group', id: 'group3', name: 'group 3', components: [] },
      { type: 'group', id: 'group4', name: 'group 4', components: [] },
      { type: 'group', id: 'other', name: 'Other group', components: [] },
    ];
    const {
      container,
      queryByText,
      unmount,
    } = render(withBuilder(<Catalogue />, {
      options: {
        otherTabEnabled: false,
      },
      components,
    }));
    fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => (
      expect(container.querySelector('.oak-popover')).toBeTruthy()
    ));
    expect(container.querySelectorAll('.oak-groups .title').length).toBe(4);
    expect(container.querySelectorAll('.oak-groups .title')[0].textContent)
      .toBe(components[0].name);
    expect(queryByText('Other group')).toBeFalsy();
    unmount();
  });

  it('should activate first group tab by default', async () => {
    const components = [
      { type: 'group', id: 'group1', name: 'group 1', components: [] },
      { type: 'group', id: 'group2', name: 'group 2', components: [] },
      { type: 'group', id: 'group3', name: 'group 3', components: [] },
      { type: 'group', id: 'group4', name: 'group 4', components: [] },
    ];
    const { container, unmount } = render(withBuilder(<Catalogue />, {
      components,
    }));
    fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => (
      expect(container.querySelector('.oak-popover')).toBeTruthy()
    ));
    expect(
      container.querySelectorAll('.oak-groups .title')[0].className
    ).toContain('active');
    expect(
      container.querySelectorAll('.oak-groups .title')[1].className
    ).not.toContain('active');
    unmount();
  });

  it('should change actived group when clicking on a group', async () => {
    const components = [
      { type: 'group', id: 'group1', name: 'group 1', components: [] },
      { type: 'group', id: 'group2', name: 'group 2', components: [] },
      { type: 'group', id: 'group3', name: 'group 3', components: [] },
      { type: 'group', id: 'group4', name: 'group 4', components: [] },
    ];
    const {
      container,
      getByText,
      unmount,
    } = render(withBuilder(<Catalogue />, {
      components,
    }));
    fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => (
      expect(container.querySelector('.oak-popover')).toBeTruthy()
    ));
    expect(
      container.querySelectorAll('.oak-groups .title')[0].className
    ).toContain('active');
    expect(
      container.querySelectorAll('.oak-groups .title')[1].className
    ).not.toContain('active');
    fireEvent.click(getByText('group 2'));

    expect(
      container.querySelectorAll('.oak-groups .title')[0].className
    ).not.toContain('active');
    expect(
      container.querySelectorAll('.oak-groups .title')[1].className
    ).toContain('active');
    unmount();
  });

  it('should display groups components', async () => {
    const components = [
      {
        type: 'group',
        id: 'group1',
        name: 'group 1',
        components: [],
      }, {
        group: 'group1',
        component: {
          id: 'first-component',
          name: 'component 1',
        },
      }, {
        group: 'group1',
        component: {
          id: 'second-component',
          name: 'component 2',
        },
      }, {
        group: 'group1',
        component: {
          id: 'third-component',
          name: 'component 3',
        },
      }, {
        group: 'group1',
        component: {
          id: 'fourth-component',
          name: 'component 4',
        },
      },
    ];

    const {
      container,
      getByText,
      unmount,
    } = render(withBuilder(<Catalogue />, {
      options: {
        otherTabEnabled: false,
      },
      components,
    }));

    fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => (
      expect(container.querySelector('.oak-popover')).toBeTruthy()
    ));
    expect(
      container.querySelectorAll('.oak-components .oak-component').length
    ).toEqual(4);
    expect(getByText('component 1')).toBeTruthy();
    unmount();
  });

  it('should not display components ' +
  'which are not in current group', async () => {
    const components = [
      {
        type: 'group',
        id: 'group1',
        name: 'group 1',
        components: [],
      }, {
        type: 'group',
        id: 'group2',
        name: 'group 2',
        components: [],
      }, {
        group: 'group2',
        component: {
          id: 'first-component',
          name: 'component 1',
        },
      }, {
        group: 'group2',
        component: {
          id: 'second-component',
          name: 'component 2',
        },
      }, {
        group: 'group1',
        component: {
          id: 'third-component',
          name: 'component 3',
        },
      }, {
        group: 'group1',
        component: {
          id: 'fourth-component',
          name: 'component 4',
        },
      },
    ];

    const {
      container,
      getByText,
      queryByText,
      unmount,
    } = render(withBuilder(<Catalogue />, {
      options: {
        otherTabEnabled: false,
      },
      components,
    }));

    fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => (
      expect(container.querySelector('.oak-popover')).toBeTruthy()
    ));
    expect(
      container.querySelectorAll('.oak-components .oak-component').length
    ).toEqual(2);
    expect(queryByText('component 1')).toBeFalsy();
    expect(getByText('component 3')).toBeTruthy();
    unmount();
  });

  it('should change displayed components when changing group', async () => {
    const components = [
      {
        type: 'group',
        id: 'group1',
        name: 'group 1',
        components: [],
      }, {
        type: 'group',
        id: 'group2',
        name: 'group 2',
        components: [],
      }, {
        group: 'group2',
        component: {
          id: 'first-component',
          name: 'component 1',
        },
      }, {
        group: 'group2',
        component: {
          id: 'second-component',
          name: 'component 2',
        },
      }, {
        group: 'group1',
        component: {
          id: 'third-component',
          name: 'component 3',
        },
      }, {
        group: 'group1',
        component: {
          id: 'fourth-component',
          name: 'component 4',
        },
      }, {
        group: 'group1',
        component: {
          id: 'fifth-component',
          name: 'component 5',
        },
      },
    ];

    const {
      container,
      getByText,
      queryByText,
      unmount,
    } = render(withBuilder(<Catalogue />, {
      options: {
        otherTabEnabled: false,
      },
      components,
    }));

    fireEvent.click(container.querySelector('.oak-catalogue .oak-handle'));
    await waitFor(() => (
      expect(container.querySelector('.oak-popover')).toBeTruthy()
    ));
    expect(
      container.querySelectorAll('.oak-components .oak-component').length
    ).toEqual(3);
    expect(queryByText('component 1')).toBeFalsy();
    expect(getByText('component 3')).toBeTruthy();

    fireEvent.click(getByText('group 2'));
    expect(
      container.querySelectorAll('.oak-components .oak-component').length
    ).toEqual(2);

    expect(getByText('component 1')).toBeTruthy();
    expect(queryByText('component 3')).toBeFalsy();
    unmount();
  });
});
