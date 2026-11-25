import { Builder, type ElementObject } from '@oakjs/core';

import { baseAddon } from '../addons';
import { buildTree } from '../tree';
import { getMarqueeRect, getMarqueeSelection } from './marquee';

const content = (): ElementObject[] => [
  { id: 'row', type: 'row', cols: [
    { id: 'col1', type: 'col', content: [
      { id: 'title', type: 'title', content: 'Title' },
      { id: 'text', type: 'text', content: 'Text' },
    ] },
    { id: 'col2', type: 'col', content: [
      { id: 'button', type: 'button', content: 'Button' },
    ] },
  ] },
  { id: 'footer', type: 'text', content: 'Footer' },
];

// Layout of the elements: [left, top, right, bottom]
const LAYOUT: Record<string, [number, number, number, number]> = {
  row: [0, 0, 200, 100],
  col1: [0, 0, 100, 100],
  title: [0, 0, 100, 40],
  text: [0, 50, 100, 90],
  col2: [100, 0, 200, 100],
  button: [110, 10, 190, 50],
  footer: [0, 120, 200, 160],
};

const setup = (hidden: string[] = []) => {
  const builder = new Builder({ addons: [baseAddon() as any], content: content() });
  const tree = buildTree(builder, builder.getContent());
  const frame = document.createElement('div');

  Object.entries(LAYOUT).forEach(([id, [left, top, right, bottom]]) => {
    const el = document.createElement('div');
    el.setAttribute('data-oak-id', id);
    el.getBoundingClientRect = () => ({
      left, top, right, bottom, x: left, y: top,
      width: right - left, height: bottom - top,
    }) as DOMRect;
    Object.defineProperty(el, 'offsetParent', {
      get: () => hidden.includes(id) ? null : frame,
    });
    frame.appendChild(el);
  });

  return { frame, tree };
};

describe('marquee', () => {
  it('should get the rect between two points in any direction', () => {
    expect(getMarqueeRect(10, 20, 5, 40))
      .toEqual({ left: 5, top: 20, right: 10, bottom: 40 });
  });

  it('should select the outermost elements touched by the box', () => {
    const { frame, tree } = setup();

    // From outside of the page, across everything
    expect(getMarqueeSelection(frame, tree, getMarqueeRect(-10, -10, 50, 130)))
      .toEqual(['row', 'footer']);
  });

  it('should not select the containers of the whole box', () => {
    const { frame, tree } = setup();

    // Inside the first column: its children
    expect(getMarqueeSelection(frame, tree, getMarqueeRect(10, 10, 50, 60)))
      .toEqual(['title', 'text']);

    // Across both columns: the columns themselves
    expect(getMarqueeSelection(frame, tree, getMarqueeRect(50, 30, 150, 60)))
      .toEqual(['col1', 'col2']);

    // Inside a single element
    expect(getMarqueeSelection(frame, tree, getMarqueeRect(10, 10, 20, 20)))
      .toEqual([]);
  });

  it('should ignore hidden elements', () => {
    const { frame, tree } = setup(['footer']);

    expect(getMarqueeSelection(frame, tree, getMarqueeRect(-10, -10, 50, 130)))
      .toEqual(['row']);
  });
});
