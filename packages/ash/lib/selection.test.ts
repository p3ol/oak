import { Builder, type ElementObject } from '@oakjs/core';

import { baseAddon } from './addons';
import { buildTree } from './tree';
import { getSelectedNodes } from './selection';

const content = (): ElementObject[] => [
  { id: 'row', type: 'row', cols: [
    { id: 'col1', type: 'col', content: [
      { id: 'title', type: 'title', content: 'Title' },
    ] },
  ] },
  { id: 'text', type: 'text', content: 'Text' },
];

describe('selection', () => {
  it('should only keep the outermost selected elements, in order', () => {
    const builder = new Builder({
      addons: [baseAddon() as any],
      content: content(),
    });
    const tree = buildTree(builder, builder.getContent());

    expect(getSelectedNodes(tree, ['text', 'title', 'row', 'missing'])
      .map(n => n.id)).toEqual(['row', 'text']);
    expect(getSelectedNodes(tree, ['title', 'col1']).map(n => n.id))
      .toEqual(['col1']);
  });
});
