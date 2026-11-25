import { render } from '@testing-library/react';

import { baseAddon } from '../addons';
import Preview from './index';

const content = () => [
  { id: 'title', type: 'title', content: 'Hello' },
  { id: 'button', type: 'button', content: 'Click me' },
];

describe('<Preview />', () => {
  it('should render the content like the canvas, read-only', () => {
    const { container } = render(
      <Preview
        addons={[baseAddon()]}
        value={content()}
        pageClassName="my-page"
        pageValue={{ color: 'red' }}
        renderPageHead={value => (
          <style data-testid="head">{ `.my-page { color: ${value.color} }` }</style>
        )}
      />
    );

    const page = container.querySelector('.oak-ash-preview .oak-ash-page');

    expect(page.classList).toContain('my-page');
    expect(page.querySelector('h1').innerHTML).toBe('Hello');
    expect(page.querySelector('[data-oak-type=button]').innerHTML)
      .toBe('Click me');
    expect(container.querySelector('[data-testid=head]').textContent)
      .toBe('.my-page { color: red }');
    // Can't be used
    expect(container.querySelector('.oak-ash-frame').hasAttribute('inert'))
      .toBe(true);
    // No editing placeholders
    expect(container.querySelector('[data-oak-placeholder]')).toBeNull();
  });

  it('should use the canvas theme classes', () => {
    const { container } = render(
      <Preview addons={[baseAddon()]} value={content()} theme="dark" />
    );

    expect(container.querySelector('.oak-ash-preview').classList)
      .toContain('oak-ash-canvas-dark');
  });

  it('should hide elements like the preview settings do', () => {
    const { container, rerender } = render(
      <Preview
        addons={[baseAddon(), {
          previewSettings: [{
            type: 'toggle',
            key: 'submitted',
            default: false,
            isElementDisplayed: (element, submitted) => submitted
              ? element.type !== 'button'
              : element.type !== 'title',
          }],
        }]}
        value={content()}
      />
    );

    // Default values
    expect(container.querySelector('h1')).toBeNull();
    expect(container.querySelector('[data-oak-type=button]')).not.toBeNull();

    rerender(
      <Preview
        addons={[baseAddon(), {
          previewSettings: [{
            type: 'toggle',
            key: 'submitted',
            default: false,
            isElementDisplayed: (element, submitted) => submitted
              ? element.type !== 'button'
              : element.type !== 'title',
          }],
        }]}
        value={content()}
        previewValue={{ submitted: true }}
      />
    );

    expect(container.querySelector('h1')).not.toBeNull();
    expect(container.querySelector('[data-oak-type=button]')).toBeNull();
  });

  it('should update when the content changes', () => {
    const { container, rerender } = render(
      <Preview addons={[baseAddon()]} value={content()} />
    );

    rerender(
      <Preview
        addons={[baseAddon()]}
        value={[{ id: 'other', type: 'title', content: 'Other' }]}
      />
    );

    expect(container.querySelector('h1').innerHTML).toBe('Other');
  });
});
