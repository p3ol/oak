import { act, fireEvent, render } from '@testing-library/react';

import { baseAddon } from '../addons';
import { useBuilder } from '../hooks';
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
        'title', expect.objectContaining({ type: 'title' })
      );

      act(() => {
        globalThis.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Escape' })
        );
      });
      expect(onSelectionChange).toHaveBeenLastCalledWith(
        'col', expect.objectContaining({ type: 'col' })
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
