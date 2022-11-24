import { render, waitFor } from '@testing-library/react';
import Editor from '.';
import userEvent from '@testing-library/user-event';

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

  describe('with link', () => {
    it('should add new link', async () => {
      const user = userEvent.setup();
      const content =
      '<span>click me</span>';
      const { container, debug } = render(
        <div><Editor value={content} onChange={() => {}} /></div>);
      await waitFor(
        () => expect(container.querySelector('.oak-prosemirror')).toBeDefined()
      );
      const mainDiv = container.querySelector('.ProseMirror');
      const startNode = mainDiv.firstChild.firstChild;
      user.dblClick(container.querySelector('.ProseMirror > div'));
      const range = document.createRange();
      range.setStart(startNode, 2);
      range.setEnd(startNode, 5);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      await user.click(document.querySelector('.oak-underline'));
      await user.click(document.querySelector('.oak-underline'));
      await waitFor(
        () => expect(
          document.querySelector('[style*="underline"]')
        ).toBeTruthy()
      );
      debug();
    });
  });
});
