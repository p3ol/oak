import type { ReactNode } from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import type { ElementObject, RendererComponentProps } from './types';
import {
  REVEAL_EVENT,
  baseComponents,
  getColClasses,
  getElementAttributes,
  getElementStatesCSS,
  getElementStyle,
  getVisibilityClasses,
  toCSSUnit,
} from './index';

const components = baseComponents();

/**
 * Minimal content tree walker, similar to what a builder or a page would do
 */
const renderElement = (
  element: ElementObject,
  props: Partial<RendererComponentProps> = {},
): ReactNode => {
  const Component = components[element.type];

  return (
    <Component
      key={element.id}
      element={element}
      attributes={getElementAttributes(element, Component)}
      renderContainer={key => (element[key] || [])
        .map((child: ElementObject) => renderElement(child, props))}
      { ...props }
    />
  );
};

describe('utils', () => {
  it('should convert values to css units', () => {
    expect(toCSSUnit(10)).toBe('10px');
    expect(toCSSUnit('10')).toBe('10px');
    expect(toCSSUnit('0')).toBe('0');
    expect(toCSSUnit('2em')).toBe('2em');
    expect(toCSSUnit('')).toBeUndefined();
    expect(toCSSUnit(null)).toBeUndefined();
  });

  it('should convert styling settings to a style object', () => {
    expect(getElementStyle({
      paddingTop: '10',
      marginLeft: 'auto',
      borderBottom: 2,
      borderBottomColor: 'red',
      borderTopLeftRadius: '4px',
      backgroundColor: '#FFF',
      backgroundImage: { url: 'https://example.com/a.png', name: 'a.png' },
      backgroundSize: 'cover',
      boxShadowY: 2,
      boxShadowBlur: 4,
    })).toEqual({
      paddingTop: '10px',
      marginLeft: 'auto',
      borderBottomWidth: '2px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'red',
      borderTopLeftRadius: '4px',
      backgroundColor: '#FFF',
      backgroundImage: 'url("https://example.com/a.png")',
      backgroundSize: 'cover',
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.25)',
    });

    expect(getElementStyle(undefined)).toEqual({});
  });

  it('should generate hover & active css', () => {
    expect(getElementStatesCSS({
      id: 'a"b',
      styles: { hover: { backgroundColor: 'red' }, active: {} },
    })).toBe('[data-oak-id="a\\"b"]:hover{background-color:red !important}');
  });

  it('should compute responsive classes', () => {
    expect(getVisibilityClasses({ responsive: { xs: 'hide', md: 'show' } }))
      .toBe('oak:@max-[575.98px]:hidden');

    expect(getColClasses({})).toBe('oak:colsize-fluid');
    expect(getColClasses({ size: 6 })).toBe('oak:colsize-6');
    expect(getColClasses({ size: 6, responsive: { xs: 12, sm: 12 } }))
      .toBe('oak:colsize-12 oak:@min-[768px]:colsize-6');
    expect(getColClasses({ size: 4, responsive: { lg: 'hide' } }))
      .toBe(
        'oak:colsize-4 oak:@min-[992px]:colsize-hide ' +
        'oak:@min-[1200px]:colsize-4'
      );
  });

  it('should compute element attributes', () => {
    expect(getElementAttributes({
      id: 1,
      type: 'title',
      settings: { className: 'custom', dir: 'rtl' },
      responsive: { xl: 'hide' },
      styles: { paddingTop: 4 },
    })).toEqual({
      'data-oak-id': '1',
      'data-oak-type': 'title',
      className: 'custom oak:@min-[1200px]:hidden',
      dir: 'rtl',
      style: { paddingTop: '4px' },
    });

    // Columns handle their own responsive classes
    expect(getElementAttributes(
      { id: 2, type: 'col', responsive: { xl: 'hide' } },
      components.col,
    ).className).toBeUndefined();
  });
});

describe('dark mode', () => {
  const element = {
    id: 'b',
    type: 'button',
    settings: { className: 'btn', dark: { className: 'btn-dark' } },
    styles: {
      backgroundColor: '#fff',
      paddingTop: 4,
      hover: { backgroundColor: '#eee' },
      dark: {
        backgroundColor: '#000',
        hover: { backgroundColor: '#111' },
      },
    },
  };

  it('should only use dark styles when asked to', () => {
    expect(getElementAttributes(element).style)
      .toEqual({ backgroundColor: '#fff', paddingTop: '4px' });
    expect(getElementAttributes(element).className).toBe('btn');

    const dark = getElementAttributes(element, undefined, { dark: true });
    expect(dark.style).toEqual({ backgroundColor: '#000', paddingTop: '4px' });
    expect(dark.className).toBe('btn btn-dark');
  });

  it('should merge dark hover styles', () => {
    expect(getElementStatesCSS(element))
      .toBe('[data-oak-id="b"]:hover{background-color:#eee !important}');
    expect(getElementStatesCSS(element, { dark: true }))
      .toBe('[data-oak-id="b"]:hover{background-color:#111 !important}');
  });
});

describe('components', () => {
  it('should render base components like a final page', () => {
    const { container } = render(renderElement({
      id: 'row',
      type: 'row',
      settings: { gap: '10px', justifyContent: 'center' },
      cols: [{
        id: 'col1',
        type: 'col',
        size: 6,
        content: [
          { id: 't', type: 'title', headingLevel: 'h2', content: 'Title' },
          { id: 'x', type: 'text', content: '<p>Some <b>text</b></p>' },
          { id: 's', type: 'empty-space', settings: { height: 20 } },
          {
            id: 'b',
            type: 'button',
            content: 'Go',
            url: 'https://example.com',
            target: '_blank',
          },
        ],
      }, {
        id: 'col2',
        type: 'col',
        content: [
          { id: 'i', type: 'image', url: 'https://example.com/a.png' },
          {
            id: 'c',
            type: 'clickable',
            action: 'event',
            event: 'clicked',
            content: [{ id: 'ct', type: 'text', content: 'Click' }],
          },
        ],
      }],
    }));

    expect(container).toMatchSnapshot();
    expect(container.querySelector('h2').innerHTML).toBe('Title');
    expect(container.querySelector('a[href="https://example.com"]')
      .getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should fire events & sanitize html', () => {
    const onEvent = vi.fn();
    const element = {
      id: 'b',
      type: 'button',
      action: 'event',
      event: 'subscribe',
      content: '<script>alert(1)</script>Subscribe',
    };
    const { getByRole } = render(renderElement(element, {
      onEvent,
      sanitizeHTML: html => html.replace(/<script.*<\/script>/, ''),
    }));

    const button = getByRole('button');
    expect(button.innerHTML).toBe('Subscribe');
    fireEvent.click(button);
    expect(onEvent).toHaveBeenCalledWith('subscribe', element);
  });

  it('should toggle foldable content', () => {
    const element = {
      id: 'f',
      type: 'foldable',
      seeMore: [{ id: 'm', type: 'text', content: 'More' }],
      seeLess: [{ id: 'l', type: 'text', content: 'Less' }],
      content: [{ id: 'c', type: 'text', content: 'Content' }],
    };
    const { container, getByText } = render(renderElement(element));
    const isHidden = (text: string) => !!getByText(text).closest('[hidden]');

    expect(isHidden('More')).toBe(false);
    expect(isHidden('Content')).toBe(true);
    expect(isHidden('Less')).toBe(true);
    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('More'));
    expect(isHidden('More')).toBe(true);
    expect(isHidden('Content')).toBe(false);
    expect(isHidden('Less')).toBe(false);

    fireEvent.click(getByText('Less'));
    expect(isHidden('Content')).toBe(true);
  });

  it('should reveal hidden foldable sections on demand', () => {
    const { getByText } = render(renderElement({
      id: 'f',
      type: 'foldable',
      seeMore: [{ id: 'm', type: 'text', content: 'More' }],
      seeLess: [{ id: 'l', type: 'text', content: 'Less' }],
      content: [{ id: 'c', type: 'text', content: 'Content' }],
    }));
    const isHidden = (text: string) => !!getByText(text).closest('[hidden]');
    const reveal = (text: string) => act(() => {
      getByText(text).dispatchEvent(
        new Event(REVEAL_EVENT, { bubbles: true })
      );
    });

    reveal('Content');
    expect(isHidden('Content')).toBe(false);

    reveal('More');
    expect(isHidden('More')).toBe(false);
    expect(isHidden('Content')).toBe(true);
  });
});
