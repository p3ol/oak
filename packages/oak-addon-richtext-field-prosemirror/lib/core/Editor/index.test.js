import { render, waitFor } from '@testing-library/react';

import Editor from '.';

describe('<Prosemirror Editor />', () => {
  it('should render', async () => {
    const { container } = render(<div><Editor /></div>);
    await waitFor(
      () => expect(container.querySelector('.oak-prosemirror')).toBeTruthy()
    );
  });

  it('should render with custom content', async () => {
    const content =
      '<span style="font-weight:bold;font-size:40px;color:#ffffff;">' +
      'Meilleure offre' +
      '</span>';
    const { container } = render(
      <div><Editor value={content} /></div>);
    await waitFor(
      () => expect(container.querySelector('.oak-prosemirror')).toBeDefined()
    );
    expect(container.querySelector('[style*="color:#ffffff"]')).toBeTruthy();
    expect(
      container.querySelector('[style*="font-weight: bold"]')
    ).toBeTruthy();
    expect(container.querySelector('[style*="font-size: 40px"]')).toBeTruthy();
  });

  it('should handle multiple paragraphs', async () => {
    const content =
    '<div>content</div><div></div><div>content</div>';
    const { container } = render(
      <div><Editor value={content} /></div>);
    await waitFor(
      () => expect(container.querySelector('.oak-prosemirror')).toBeDefined()
    );
    expect(
      container.querySelector('.ProseMirror').querySelectorAll('div').length
    ).toEqual(3);
    expect(
      container.querySelectorAll('.ProseMirror br').length
    ).toBeGreaterThan(0);
  });
});
