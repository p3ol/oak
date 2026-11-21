import { act, fireEvent, render, waitFor } from '@testing-library/react';

import { baseAddon } from '../addons';
import type { PreviewSettingObject, PreviewValue } from '../types';
import { useBuilder, usePreviewValue } from '../hooks';
import Builder from './index';

const content = [
  { id: 'row', type: 'row', cols: [
    { id: 'col', type: 'col', content: [
      { id: 'title', type: 'title', content: 'Hello' },
      { id: 'button', type: 'button', content: 'Click me' },
    ] },
  ] },
];

describe('<Builder />', () => {
  it('should render the page, layers & page properties', () => {
    const { container, getByText, getAllByRole } = render(
      <Builder addons={[baseAddon()]} defaultValue={content} />
    );

    // Page is rendered with the real components
    expect(container.querySelector('.oak-ash-page h1').innerHTML)
      .toBe('Hello');
    expect(container.querySelector('.oak-ash-page [data-oak-type=button]').innerHTML)
      .toBe('Click me');

    // Layers
    expect(getAllByRole('treeitem').length).toBe(4);

    // Page properties when nothing is selected
    expect(getByText('Screen size')).toBeTruthy();
  });

  it('should select an element from the layers and show its properties', () => {
    const { getAllByRole, getByText } = render(
      <Builder addons={[baseAddon()]} defaultValue={content} />
    );

    fireEvent.click(getAllByRole('treeitem')[2]);
    expect(getByText('Title options')).toBeTruthy();
  });

  it('should delete the selected element with backspace', () => {
    const onChange = vi.fn();
    const { getAllByRole, container } = render(
      <Builder
        addons={[baseAddon()]}
        defaultValue={content}
        onChange={onChange}
      />
    );

    expect(container.querySelector('.oak-ash-page [data-oak-type=button]'))
      .not.toBeNull();
    fireEvent.click(getAllByRole('treeitem')[3]);
    act(() => {
      globalThis.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Backspace' })
      );
    });

    expect(container.querySelector('.oak-ash-page [data-oak-type=button]')).toBeNull();
    expect(onChange).toHaveBeenCalled();
  });

  it('should preview the content in context', () => {
    const { container, getByRole } = render(
      <Builder
        addons={[baseAddon()]}
        defaultValue={content}
        defaultPreviewMode="modal"
      />
    );

    // The page is still rendered (once), inside the modal
    expect(container.querySelectorAll('.oak-ash-page').length).toBe(1);
    expect(container.querySelector('.oak-ash-frame').closest('.oak\\:rounded-xl'))
      .not.toBeNull();

    const articleButton = getByRole('button', { name: /Inside an article/ });
    fireEvent.click(articleButton);
    expect(container.querySelectorAll('.oak-ash-page').length).toBe(1);
    expect(container.querySelector('.oak-ash-frame').closest('.oak\\:rounded-xl'))
      .toBeNull();
    expect(articleButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('should handle interface & canvas themes separately', () => {
    const { container, getByRole } = render(
      <Builder
        theme="dark"
        defaultCanvasTheme="light"
        addons={[baseAddon()]}
        defaultValue={[{
          id: 'title',
          type: 'title',
          content: 'Hello',
          styles: { backgroundColor: '#fff', dark: { backgroundColor: '#000' } },
        }]}
      />
    );
    const title = () => container.querySelector('.oak-ash-page h1') as HTMLElement;

    expect(container.querySelector('.oak-ash').classList)
      .toContain('dark');
    expect(container.querySelector('.oak-ash-canvas').classList)
      .not.toContain('oak-ash-canvas-dark');
    expect(title().style.backgroundColor).toBe('rgb(255, 255, 255)');

    fireEvent.click(getByRole('button', { name: /dark mode/ }));

    expect(container.querySelector('.oak-ash-canvas').classList)
      .toContain('oak-ash-canvas-dark');
    expect(title().style.backgroundColor).toBe('rgb(0, 0, 0)');
    // The interface theme doesn't change
    expect(container.querySelector('.oak-ash').classList)
      .toContain('dark');
  });

  it('should copy, cut & paste elements with clipboard events', () => {
    const { getAllByRole, container } = render(
      <Builder addons={[baseAddon()]} defaultValue={content} />
    );
    const clipboard: Record<string, string> = {};
    const fire = (type: string) => act(() => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.assign(event, {
        clipboardData: {
          setData: (format: string, value: string) => {
            clipboard[format] = value;
          },
          getData: (format: string) => clipboard[format],
        },
      });
      document.dispatchEvent(event);
    });
    const titles = () => container.querySelectorAll('.oak-ash-page h1');

    // Select the title & copy it
    fireEvent.click(getAllByRole('treeitem')[2]);
    fire('copy');
    expect(JSON.parse(clipboard['text/plain'])).toMatchObject({
      type: 'title', content: 'Hello',
    });

    // Paste after the selected title
    fire('paste');
    expect(titles().length).toBe(2);

    // Cut the pasted title (selected after paste)
    fire('cut');
    expect(titles().length).toBe(1);
  });

  it('should reveal selected elements hidden in a collapsed foldable', () => {
    const { container, getByText } = render(
      <Builder
        addons={[baseAddon()]}
        defaultValue={[{
          id: 'foldable',
          type: 'foldable',
          seeMore: [{ id: 'more', type: 'text', content: 'More' }],
          seeLess: [{ id: 'less', type: 'text', content: 'Less' }],
          content: [{ id: 'inner', type: 'text', content: 'Inner content' }],
        }]}
      />
    );
    const inner = () => container
      .querySelector('.oak-ash-page [data-oak-id="inner"]');

    expect(inner().closest('[hidden]')).not.toBeNull();

    // Select the hidden text from the layers panel
    fireEvent.click(getByText('Inner content', { selector: '[role=treeitem] *' }));

    expect(inner().closest('[hidden]')).toBeNull();
  });

  it('should display page settings from props & addons', () => {
    const onPageChange = vi.fn();
    const { container, getByText, getByPlaceholderText, rerender } = render(
      <Builder
        addons={[baseAddon(), {
          pageSettings: [{
            type: 'textarea',
            key: 'customCss',
            label: 'Custom CSS',
            placeholder: 'css',
          }],
        }]}
        defaultValue={content}
        pageSettings={[{
          type: 'text',
          key: 'meta.title',
          label: 'Page title',
          placeholder: 'title',
        }]}
        defaultPageValue={{ customCss: 'h1 { color: red }' }}
        onPageChange={onPageChange}
        renderPageHead={value => <style>{ value.customCss }</style>}
      />
    );

    expect(getByText('Custom CSS')).toBeTruthy();
    expect(getByText('Page title')).toBeTruthy();
    expect((getByPlaceholderText('css') as HTMLTextAreaElement).value)
      .toBe('h1 { color: red }');
    expect(container.querySelector('.oak-ash-frame style').textContent)
      .toBe('h1 { color: red }');

    fireEvent.change(getByPlaceholderText('title'), {
      target: { value: 'My paywall' },
    });
    expect(onPageChange).toHaveBeenLastCalledWith({
      customCss: 'h1 { color: red }',
      meta: { title: 'My paywall' },
    });

    fireEvent.change(getByPlaceholderText('css'), {
      target: { value: 'h1 { color: blue }' },
    });
    expect(container.querySelector('.oak-ash-frame style').textContent)
      .toBe('h1 { color: blue }');

    // Controlled value
    rerender(
      <Builder
        addons={[baseAddon()]}
        defaultValue={content}
        pageSettings={[{ type: 'text', key: 'meta.title', placeholder: 'title' }]}
        pageValue={{ meta: { title: 'From outside' } }}
      />
    );
    expect((getByPlaceholderText('title') as HTMLInputElement).value)
      .toBe('From outside');
  });

  it('should apply the same rules to page settings as to element settings', () => {
    const { container, queryByText } = render(
      <Builder
        addons={[baseAddon(), {
          overrides: [{
            // Change a page setting
            type: 'setting',
            targets: ['page'],
            key: 'b',
            label: 'B (overridden)',
            priority: 100,
          }, {
            // Add a page setting
            type: 'component',
            targets: ['page'],
            fields: [{ type: 'text', key: 'd', label: 'D', priority: 50 }],
          }],
        }]}
        defaultValue={content}
        pageSettings={[
          { type: 'text', key: 'a', label: 'A', priority: 10 },
          { type: 'text', key: 'b', label: 'B', priority: 1 },
          {
            type: 'text',
            key: 'c',
            label: 'C',
            condition: (element: any) => element.a === 'show c',
          },
        ]}
        defaultPageValue={{ a: 'hide c' }}
      />
    );
    const labels = () => Array.from(
      container.querySelectorAll('.oak-ash-page-settings .junipero.label')
    ).map(l => l.textContent);

    // Sorted by priority (including overrides), with overridden labels,
    // fields added by overrides, and conditions
    expect(labels()).toEqual(['B (overridden)', 'D', 'A']);
    expect(queryByText('C')).toBeNull();

    // Conditions are re-evaluated with the new page value
    const inputs = container.querySelectorAll('.oak-ash-page-settings input');
    fireEvent.change(inputs[2], { target: { value: 'show c' } });
    expect(labels()).toEqual(['B (overridden)', 'D', 'A', 'C']);
  });

  it('should not border page settings groups', () => {
    const { container } = render(
      <Builder
        addons={[baseAddon()]}
        defaultValue={content}
        pageSettings={[{
          type: 'group',
          key: 'seo',
          label: 'SEO',
          fields: [{ type: 'text', key: 'title', label: 'Title' }],
        }]}
      />
    );

    const toggle = container
      .querySelector('.oak-ash-page-settings .fields-group-toggle');
    expect(toggle.textContent).toBe('SEO');
    expect(toggle.className).not.toContain('oak:border-y');

    // Open content has its own background (jsdom can't scroll)
    Element.prototype.scrollIntoView ??= () => {};

    fireEvent.click(toggle);
    expect(container.querySelector('.oak-ash-page-settings .fields-group .fields')
      .className).toContain('oak:bg-seashell');
  });

  it('should scroll opened groups below the sticky tabs titles', () => {
    const scrollIntoView = vi.fn();
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = scrollIntoView;
    // jsdom has no layout
    const offsetHeight = vi
      .spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
      .mockImplementation(function (this: HTMLElement) {
        return this.classList.contains('titles') ? 42 : 0;
      });

    try {
      const { container, getByText } = render(
        <Builder
          addons={[baseAddon()]}
          defaultValue={content}
          pageSettings={[
            {
              type: 'group',
              key: 'seo',
              label: 'SEO',
              fields: [{ type: 'text', key: 'title', label: 'Title' }],
            },
            { type: 'tab', key: 'css', title: 'CSS', fields: [] },
          ] as any}
        />
      );

      fireEvent.click(getByText('SEO'));

      const toggle = container.querySelector<HTMLElement>(
        '.oak-ash-page-settings .fields-group-toggle'
      );
      expect(toggle.style.scrollMarginTop).toBe('42px');
      expect(scrollIntoView).toHaveBeenCalled();
    } finally {
      Element.prototype.scrollIntoView = original;
      offsetHeight.mockRestore();
    }
  });

  it('should display page settings tabs', () => {
    const { container, getByText, queryByText } = render(
      <Builder
        addons={[baseAddon()]}
        defaultValue={content}
        pageSettings={[
          { type: 'text', key: 'slug', label: 'Slug' },
          {
            type: 'tab',
            key: 'css',
            title: 'CSS',
            fields: [{ type: 'textarea', key: 'css', label: 'Custom CSS' }],
          },
          {
            type: 'tab',
            key: 'hidden',
            title: 'Hidden',
            condition: () => false,
            fields: [{ type: 'text', key: 'hidden', label: 'Hidden field' }],
          },
        ] as any}
      />
    );

    const titles = () => Array.from(
      container.querySelectorAll('.oak-ash-page-settings .titles li')
    ).map(l => l.textContent);

    // Other settings are in a "Settings" tab, hidden tabs are not displayed
    expect(titles()).toEqual(['Settings', 'CSS']);
    expect(getByText('Slug')).toBeTruthy();
    expect(queryByText('Custom CSS')).toBeNull();

    fireEvent.click(getByText('CSS'));
    expect(getByText('Custom CSS')).toBeTruthy();
    expect(queryByText('Slug')).toBeNull();

    // Preview settings are still displayed below
    expect(getByText('Screen size')).toBeTruthy();
  });

  it('should allow to customize the page properties title', () => {
    const { getByText, queryByText, rerender } = render(
      <Builder
        addons={[baseAddon()]}
        defaultValue={content}
        pageTitle="Appearance"
        pageDescription="Paywall #12"
      />
    );

    expect(getByText('Appearance')).toBeTruthy();
    expect(getByText('Paywall #12')).toBeTruthy();
    expect(queryByText('element(s)')).toBeNull();

    rerender(
      <Builder
        addons={[baseAddon()]}
        defaultValue={content}
        pageTitle="Element"
        pageDescription={null}
      />
    );
    expect(getByText('Element')).toBeTruthy();
    expect(queryByText('Paywall #12')).toBeNull();
  });

  it('should render a custom header above the sidebar panels', () => {
    const Header = () => {
      const { canUndo } = useBuilder();

      return <button type="button">Back ({ canUndo ? 'dirty' : 'saved' })</button>;
    };

    const { getByText, container } = render(
      <Builder
        addons={[baseAddon()]}
        defaultValue={content}
        header={<Header />}
        headerClassName="custom-header"
      />
    );

    const header = container.querySelector('.oak-ash-sidebar-header');
    expect(header.classList).toContain('custom-header');
    // Rendered before the layers & insert tabs
    expect(header.nextElementSibling.getAttribute('role')).toBe('tablist');
    expect(getByText('Back (saved)')).toBeTruthy();
  });

  it('should display custom content on empty pages', () => {
    const onClick = vi.fn();
    const { getByText, queryByText, rerender } = render(
      <Builder
        addons={[baseAddon()]}
        value={[]}
        emptyPageContent={(
          <button type="button" onClick={onClick}>Use a template</button>
        )}
      />
    );

    fireEvent.click(getByText('Use a template'));
    expect(onClick).toHaveBeenCalled();
    expect(getByText('Drop components here, or pick one in the Insert panel'))
      .toBeTruthy();

    // Only on empty pages
    rerender(
      <Builder
        addons={[baseAddon()]}
        value={[{ id: 'title', type: 'title', content: 'Hello' }]}
        emptyPageContent={<button type="button">Use a template</button>}
      />
    );
    expect(queryByText('Use a template')).toBeNull();
  });

  it('should update the previewed state when interacting with the canvas', () => {
    // A tab: elements are displayed depending on its value, clickables
    // change it
    const tabSetting: PreviewSettingObject = {
      type: 'text',
      key: 'tab',
      default: 'first',
      isElementDisplayed: (element, value) => (
        !element.settings?.tab || element.settings.tab === value
      ),
      onElementEvent: (element, value) => (
        element.action === 'change-field' && element.fieldValue !== value
          ? element.fieldValue
          : undefined
      ),
    };
    const { container } = render(
      <Builder
        addons={[baseAddon()]}
        previewSettings={[tabSetting]}
        defaultValue={[
          { id: 'switch', type: 'clickable', action: 'change-field',
            fieldValue: 'second', content: [
              { id: 'label', type: 'text', content: 'Second tab' },
            ] },
          { id: 'first', type: 'text', content: 'First content',
            settings: { tab: 'first' } },
          { id: 'second', type: 'text', content: 'Second content',
            settings: { tab: 'second' } },
          { id: 'link', type: 'clickable', action: 'link', url: '/',
            content: [{ id: 'link-label', type: 'text', content: 'Link' }] },
        ]}
      />
    );
    const page = container.querySelector('.oak-ash-page');
    const displayed = (id: string) => (
      !!page.querySelector(`[data-oak-id="${id}"]`)
    );

    expect(displayed('first')).toBe(true);
    expect(displayed('second')).toBe(false);

    fireEvent.click(page.querySelector('[data-oak-id="switch"]'));
    expect(displayed('first')).toBe(false);
    expect(displayed('second')).toBe(true);

    // Links are never followed in the canvas
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    page.querySelector('[data-oak-id="link"]').dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(displayed('second')).toBe(true);
  });

  describe('multiple selection', () => {
    // The builder mutates its content (other tests delete elements)
    const items = () => [
      { id: 'title', type: 'title', content: 'Hello' },
      { id: 'text', type: 'text', content: 'World' },
      { id: 'button', type: 'button', content: 'Click me' },
    ];

    const pressKey = (init: KeyboardEventInit) => act(() => {
      globalThis.dispatchEvent(new KeyboardEvent('keydown', init));
    });

    it('should select several elements from the layers', () => {
      // Laid out (jsdom has no layout)
      const offsetParent = vi.spyOn(
        HTMLElement.prototype, 'offsetParent', 'get'
      ).mockReturnValue(document.body);
      const onSelectionChange = vi.fn();
      const { container, getAllByRole, getByTestId, queryByTestId } = render(
        <Builder
          addons={[baseAddon()]}
          defaultValue={items()}
          onSelectionChange={onSelectionChange}
        />
      );
      const layers = () => getAllByRole('treeitem');

      fireEvent.click(layers()[0]);
      fireEvent.click(layers()[2], { shiftKey: true });

      expect(layers().map(l => l.getAttribute('aria-selected')))
        .toEqual(['true', 'false', 'true']);
      expect(getByTestId('SelectionCount').textContent)
        .toBe('2 elements selected');
      // Every selected element is outlined
      expect(container.querySelectorAll('[data-oak-selected-outline]'))
        .toHaveLength(2);
      expect(onSelectionChange).toHaveBeenLastCalledWith(
        'button', expect.objectContaining({ type: 'button' }), {
          ids: ['title', 'button'],
          elements: [
            expect.objectContaining({ type: 'title' }),
            expect.objectContaining({ type: 'button' }),
          ],
        }
      );

      // Toggled off
      fireEvent.click(layers()[0], { metaKey: true });
      expect(queryByTestId('SelectionCount')).toBeNull();
      expect(layers().map(l => l.getAttribute('aria-selected')))
        .toEqual(['false', 'false', 'true']);

      // A simple click only selects this element
      fireEvent.click(layers()[1], { shiftKey: true });
      fireEvent.click(layers()[0]);
      expect(layers().map(l => l.getAttribute('aria-selected')))
        .toEqual(['true', 'false', 'false']);

      offsetParent.mockRestore();
    });

    it('should select several elements from the canvas', () => {
      const { container, getByTestId } = render(
        <Builder addons={[baseAddon()]} defaultValue={items()} />
      );

      const click = (id: string, init: MouseEventInit = {}) => {
        fireEvent.mouseDown(
          container.querySelector(`.oak-ash-page [data-oak-id="${id}"]`),
          { button: 0, ...init },
        );
        fireEvent.mouseUp(window);
      };

      click('title');
      click('text', { shiftKey: true });
      expect(getByTestId('SelectionCount').textContent)
        .toBe('2 elements selected');
    });

    it('should select several elements with a selection box', async () => {
      // Laid out (jsdom has no layout): elements are stacked, 40px high
      const offsetParent = vi.spyOn(
        HTMLElement.prototype, 'offsetParent', 'get'
      ).mockReturnValue(document.body);
      const ids = ['title', 'text', 'button'];
      const rect = vi.spyOn(Element.prototype, 'getBoundingClientRect')
        .mockImplementation(function (this: Element) {
          const i = ids.indexOf(this.getAttribute('data-oak-id'));
          const top = i * 50;

          return (i < 0
            ? { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }
            : {
              left: 0, top, right: 300, bottom: top + 40,
              width: 300, height: 40,
            }) as DOMRect;
        });
      const { container, getByTestId, queryByTestId } = render(
        <Builder addons={[baseAddon()]} defaultValue={items()} />
      );
      const canvas = container.querySelector('.oak-ash-canvas');

      // From the empty canvas, across the first two elements
      fireEvent.mouseDown(canvas, { button: 0, clientX: -20, clientY: -20 });
      fireEvent.mouseMove(window, { clientX: 100, clientY: 60 });

      expect(container.querySelector('[data-oak-marquee]')).toBeTruthy();
      await waitFor(() => {
        expect(getByTestId('SelectionCount').textContent)
          .toBe('2 elements selected');
      });

      fireEvent.mouseUp(window);
      expect(container.querySelector('[data-oak-marquee]')).toBeNull();
      expect(container.querySelectorAll('[data-oak-selected-outline]'))
        .toHaveLength(2);

      // Holding shift adds to the current selection
      fireEvent.mouseDown(canvas, {
        button: 0, clientX: -20, clientY: 130, shiftKey: true,
      });
      fireEvent.mouseMove(window, { clientX: 100, clientY: 150 });
      await waitFor(() => {
        expect(getByTestId('SelectionCount').textContent)
          .toBe('3 elements selected');
      });
      fireEvent.mouseUp(window);

      // A simple click on the empty canvas clears the selection
      fireEvent.mouseDown(canvas, { button: 0, clientX: -20, clientY: -20 });
      fireEvent.mouseUp(window);
      expect(queryByTestId('SelectionCount')).toBeNull();
      expect(container.querySelectorAll('[data-oak-selected-outline]'))
        .toHaveLength(0);

      rect.mockRestore();
      offsetParent.mockRestore();
    });

    it('should remove & duplicate selected elements at once', () => {
      const onChange = vi.fn();
      const { getAllByRole, getByTestId } = render(
        <Builder
          addons={[baseAddon()]}
          defaultValue={items()}
          onChange={onChange}
        />
      );
      const types = () => onChange.mock.lastCall[0].map(
        (e: { type: string }) => e.type
      );

      fireEvent.click(getAllByRole('treeitem')[0]);
      fireEvent.click(getAllByRole('treeitem')[2], { shiftKey: true });

      pressKey({ key: 'd', metaKey: true });
      expect(types()).toEqual(['title', 'title', 'text', 'button', 'button']);
      // Duplicates are selected
      expect(getByTestId('SelectionCount').textContent)
        .toBe('2 elements selected');

      pressKey({ key: 'Backspace' });
      expect(types()).toEqual(['title', 'text', 'button']);

      // Undone at once
      pressKey({ key: 'z', metaKey: true });
      expect(types()).toEqual(['title', 'title', 'text', 'button', 'button']);
    });

    it('should select every element with mod + a', () => {
      const { container, getByTestId, queryByTestId } = render(
        <Builder
          addons={[baseAddon()]}
          defaultValue={[
            { id: 'row', type: 'row', cols: [
              { id: 'col', type: 'col', content: [
                { id: 'nested', type: 'text', content: 'Nested' },
              ] },
            ] },
            ...items(),
          ]}
        />
      );

      pressKey({ key: 'a', code: 'KeyA', ctrlKey: true, cancelable: true });
      // Top level elements (their children are included)
      expect(getByTestId('SelectionCount').textContent)
        .toBe('4 elements selected');

      // Typing in a field selects its text instead
      fireEvent.click(container.querySelector('.oak-ash-canvas'));
      pressKey({ key: 'Escape' });
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();
      act(() => {
        input.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'a', code: 'KeyA', metaKey: true, bubbles: true,
        }));
      });
      expect(queryByTestId('SelectionCount')).toBeNull();
      input.remove();
    });

    it('should copy & cut selected elements', () => {
      const onChange = vi.fn();
      const { getAllByRole } = render(
        <Builder
          addons={[baseAddon()]}
          defaultValue={items()}
          onChange={onChange}
        />
      );
      let copied = '';
      const dispatch = (type: string) => act(() => {
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.assign(event, {
          clipboardData: {
            setData: (_: string, value: string) => {
              copied = value;
            },
            getData: () => copied,
          },
        });
        document.dispatchEvent(event);
      });

      fireEvent.click(getAllByRole('treeitem')[0]);
      fireEvent.click(getAllByRole('treeitem')[1], { shiftKey: true });

      dispatch('cut');
      expect(onChange.mock.lastCall[0].map((e: { type: string }) => e.type))
        .toEqual(['button']);
      expect(copied).toContain('Hello');
      expect(copied).toContain('World');

      // Nothing selected anymore: pasted at the end of the page
      dispatch('paste');
      expect(onChange.mock.lastCall[0].map((e: { type: string }) => e.type))
        .toEqual(['button', 'title', 'text']);
    });
  });

  describe('preview settings', () => {
    // The builder mutates its content (other tests delete elements)
    const formContent = () => [
      { id: 'title', type: 'title', content: 'Hello' },
      { id: 'button', type: 'button', content: 'Click me' },
    ];

    // Buttons are hidden once the form has been submitted, titles are only
    // displayed then
    const submitted: PreviewSettingObject = {
      type: 'toggle',
      key: 'submitted',
      label: 'Form',
      checkedLabel: 'Submitted',
      uncheckedLabel: 'Not submitted',
      default: false,
      condition: (_, { builder }) => JSON.stringify(builder.getContent())
        .includes('"button"'),
      isElementDisplayed: (element, value) => value
        ? element.type !== 'button'
        : element.type !== 'title',
    };

    const toggle = (container: HTMLElement) => fireEvent.click(
      container.querySelector('.oak-ash-preview-settings input')
    );

    it('should preview the content in another state', () => {
      const { container, getByText, getAllByRole } = render(
        <Builder
          addons={[baseAddon(), { previewSettings: [submitted] }]}
          defaultValue={formContent()}
        />
      );
      const page = container.querySelector('.oak-ash-page');

      // Rendered like page settings
      expect(getByText('Form')).toBeTruthy();
      expect(getByText('Not submitted')).toBeTruthy();
      expect(page.querySelector('h1')).toBeNull();
      expect(page.querySelector('[data-oak-type=button]')).not.toBeNull();

      toggle(container);

      expect(getByText('Submitted')).toBeTruthy();
      expect(page.querySelector('h1').innerHTML).toBe('Hello');
      expect(page.querySelector('[data-oak-type=button]')).toBeNull();

      // Hidden elements are still listed in the layers
      const layers = getAllByRole('treeitem');
      expect(layers).toHaveLength(2);
      expect(layers[1].getAttribute('data-hidden')).toBe('true');
      expect(layers[1].querySelector('[data-testid=LayerHidden]'))
        .not.toBeNull();
      expect(layers[0].getAttribute('data-hidden')).toBeNull();
    });

    it('should only apply displayed settings', () => {
      const { container, queryByText } = render(
        <Builder
          addons={[baseAddon()]}
          previewSettings={[submitted]}
          defaultValue={[{ id: 'title', type: 'title', content: 'Hello' }]}
        />
      );

      expect(queryByText('Not submitted')).toBeNull();
      // Not previewed: displayed as usual
      expect(container.querySelector('.oak-ash-page h1')).not.toBeNull();
    });

    it('should support any setting, inside groups too', () => {
      const { container, getByText } = render(
        <Builder
          addons={[baseAddon()]}
          previewSettings={[{
            type: 'group',
            key: 'visitor-group',
            label: 'Visitor',
            fields: [{
              type: 'select',
              key: 'visitor.status',
              label: 'Status',
              default: 'member',
              options: [
                { title: 'Anonymous', value: 'anonymous' },
                { title: 'Member', value: 'member' },
              ],
              isElementDisplayed: (element, status) =>
                element.type !== 'button' || status === 'anonymous',
            }],
          }]}
          defaultValue={formContent()}
        />
      );

      expect(getByText('Visitor')).toBeTruthy();
      // Default value
      expect(container.querySelector('.oak-ash-page h1')).not.toBeNull();
      expect(container.querySelector('.oak-ash-page [data-oak-type=button]'))
        .toBeNull();
    });

    it('should display preview settings below the native ones by default',
      () => {
        const { getByText } = render(
          <Builder
            addons={[baseAddon()]}
            previewSettings={[{
              type: 'text',
              key: 'below',
              label: 'Below',
            }, {
              type: 'text',
              key: 'above',
              label: 'Above',
              // Native preview settings have a priority of 0
              priority: 1,
            }]}
            defaultValue={formContent()}
          />
        );

        const screenSize = getByText('Screen size');
        const follows = (a: HTMLElement, b: HTMLElement) =>
          !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

        expect(follows(getByText('Above'), screenSize)).toBe(true);
        expect(follows(screenSize, getByText('Below'))).toBe(true);
      });

    it('should give the preview values to renderers', () => {
      const values: PreviewValue[] = [];

      const Title = () => {
        values.push(usePreviewValue());

        return <h1>Title</h1>;
      };

      const { container } = render(
        <Builder
          addons={[baseAddon(), {
            previewSettings: [{ ...submitted, isElementDisplayed: undefined }],
            overrides: [{
              type: 'component',
              targets: ['title'],
              render: Title,
            }],
          }]}
          defaultValue={formContent()}
        />
      );

      expect(values.at(-1)).toEqual({});
      toggle(container);
      expect(values.at(-1)).toEqual({ submitted: true });
    });

    it('should not give preview values outside of the builder', () => {
      const values: PreviewValue[] = [];

      const Title = (): null => {
        values.push(usePreviewValue());

        return null;
      };

      render(<Title />);
      expect(values).toEqual([{}]);
    });
  });

  describe('save', () => {
    const pressSave = () => {
      const event = new KeyboardEvent('keydown', {
        key: 's', code: 'KeyS', metaKey: true, cancelable: true,
      });

      act(() => {
        globalThis.dispatchEvent(event);
      });

      return event;
    };

    it('should save with Cmd/Ctrl + S', () => {
      const onSave = vi.fn();
      render(
        <Builder
          addons={[baseAddon()]}
          defaultValue={content}
          defaultPageValue={{ customCss: 'h1 {}' }}
          onSave={onSave}
        />
      );

      const event = pressSave();
      expect(event.defaultPrevented).toBe(true);
      expect(onSave).toHaveBeenCalledTimes(1);
      expect(onSave.mock.calls[0][0][0].type).toBe('row');
      expect(onSave.mock.calls[0][1]).toEqual({
        pageValue: { customCss: 'h1 {}' },
      });
    });

    it('should commit pending property changes before saving', () => {
      const onSave = vi.fn();
      const { getAllByRole, container } = render(
        <Builder addons={[baseAddon()]} defaultValue={content} onSave={onSave} />
      );

      // Select the title & edit it (changes are committed after a delay)
      fireEvent.click(getAllByRole('treeitem')[2]);
      const textarea = container.querySelector(
        '.oak-ash-sidebar textarea'
      ) as HTMLTextAreaElement;
      textarea.focus();
      fireEvent.change(textarea, { target: { value: 'Edited' } });

      // Saving works while typing in a field
      pressSave();

      const saved = onSave.mock.calls[0][0];
      expect(saved[0].cols[0].content[0].content).toBe('Edited');
    });

    it('should let the browser handle Cmd/Ctrl + S without onSave', () => {
      render(<Builder addons={[baseAddon()]} defaultValue={content} />);

      expect(pressSave().defaultPrevented).toBe(false);
    });

    it('should expose save() to custom components', () => {
      const onSave = vi.fn();

      const SaveButton = () => {
        const { save } = useBuilder();

        return <button type="button" onClick={() => save()}>Save</button>;
      };

      const { getByText } = render(
        <Builder
          addons={[baseAddon()]}
          defaultValue={content}
          header={<SaveButton />}
          onSave={onSave}
        />
      );

      fireEvent.click(getByText('Save'));
      expect(onSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('collaboration', () => {
    // Elements given to the builder are mutated: use a fresh copy
    const freshContent = () => [
      { id: 'row', type: 'row', cols: [
        { id: 'col', type: 'col', content: [
          { id: 'title', type: 'title', content: 'Hello' },
          { id: 'button', type: 'button', content: 'Click me' },
        ] },
      ] },
    ];

    it('should use an external history controller', () => {
      const history = {
        canUndo: true,
        canRedo: false,
        undo: vi.fn(),
        redo: vi.fn(),
      };
      const ref = { current: null as any };
      const { getAllByRole, getByRole } = render(
        <Builder
          ref={ref}
          addons={[baseAddon()]}
          defaultValue={freshContent()}
          history={history}
        />
      );

      // The builder's own history is disabled
      fireEvent.click(getAllByRole('treeitem')[3]);
      act(() => {
        globalThis.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Backspace' })
        );
      });
      expect(ref.current.builder.canUndo()).toBe(false);

      // Toolbar & shortcuts use the controller
      const undoButton = getByRole('button', { name: /undo/i });
      const redoButton = getByRole('button', { name: /redo/i });
      expect((undoButton as HTMLButtonElement).disabled).toBe(false);
      expect((redoButton as HTMLButtonElement).disabled).toBe(true);

      fireEvent.click(undoButton);
      act(() => {
        globalThis.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'z', metaKey: true, shiftKey: true,
        }));
      });
      expect(history.undo).toHaveBeenCalledTimes(1);
      expect(history.redo).toHaveBeenCalledTimes(1);
    });

    it('should notify selection changes', () => {
      const onSelectionChange = vi.fn();
      const { getAllByRole } = render(
        <Builder
          addons={[baseAddon()]}
          defaultValue={freshContent()}
          onSelectionChange={onSelectionChange}
        />
      );

      fireEvent.click(getAllByRole('treeitem')[2]);
      expect(onSelectionChange).toHaveBeenLastCalledWith(
        'title', expect.objectContaining({ type: 'title' }), {
          ids: ['title'],
          elements: [expect.objectContaining({ type: 'title' })],
        }
      );

      act(() => {
        globalThis.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Escape' })
        );
      });
      expect(onSelectionChange).toHaveBeenLastCalledWith(
        'col', expect.objectContaining({ type: 'col' }), {
          ids: ['col'],
          elements: [expect.objectContaining({ type: 'col' })],
        }
      );
    });

    it('should display collaborators selections in the layers', () => {
      const { container } = render(
        <Builder
          addons={[baseAddon()]}
          defaultValue={freshContent()}
          collaborators={[
            { id: 1, name: 'Alice', selectedId: 'title', color: 'red' },
            { id: 2, name: 'Bob', selectedId: 'title' },
            { id: 3, name: 'Carol' },
          ]}
        />
      );

      const avatars = container.querySelectorAll('.oak-ash-collaborator-avatar');
      expect(Array.from(avatars).map(a => a.textContent)).toEqual(['A', 'B']);
      expect(avatars[0].closest('[role=treeitem]').textContent)
        .toContain('Hello');
      expect((avatars[0] as HTMLElement).style.background).toBe('red');
      expect((avatars[1] as HTMLElement).style.background).toMatch(/var\(--junipero-/);
    });
  });
});
