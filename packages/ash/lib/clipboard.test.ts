import { Builder } from '@oakjs/core';

import { baseAddon } from './addons';
import { buildTree } from './tree';
import {
  parseClipboardElements,
  pasteElements,
  serializeElements,
} from './clipboard';

const getBuilder = () => new Builder({
  addons: [baseAddon() as any],
  content: [
    { id: 'row', type: 'row', cols: [{ id: 'col', type: 'col', content: [
      { id: 'title', type: 'title', content: 'Title' },
    ] }] },
    { id: 'clickable', type: 'clickable', content: [] },
  ],
});

describe('clipboard', () => {
  it('should parse clipboard content', () => {
    const builder = getBuilder();

    expect(parseClipboardElements(builder, 'not json')).toEqual([]);
    expect(parseClipboardElements(builder, '"text"')).toEqual([]);
    expect(parseClipboardElements(builder, null)).toEqual([]);
    expect(parseClipboardElements(builder, JSON.stringify([
      { type: 'title' }, { type: 'unknown' },
    ]))).toEqual([{ type: 'title' }]);
    expect(serializeElements([{ type: 'title' }])).toBe('{"type":"title"}');
  });

  it('should paste elements after the selection with new ids', () => {
    const builder = getBuilder();
    const tree = buildTree(builder, builder.getContent());
    const title = tree.nodes.get('title').element;

    const added = pasteElements(builder, tree, 'title', [
      JSON.parse(serializeElements([title])),
    ]);
    const col = tree.nodes.get('col').element as { content: any[] };

    expect(col.content.length).toBe(2);
    expect(col.content[1]).toBe(added[0]);
    expect(added[0].id).not.toBe('title');
    expect(added[0].content).toBe('Title');
  });

  it('should not paste disallowed elements', () => {
    const builder = getBuilder();
    const tree = buildTree(builder, builder.getContent());

    // clickable disallows clickables: pasted after it instead
    pasteElements(builder, tree, 'clickable', [{ type: 'clickable' }]);
    expect(builder.getContent().map(e => e.type))
      .toEqual(['row', 'clickable', 'clickable']);

    // columns cannot be pasted outside of rows
    expect(pasteElements(builder, buildTree(builder, builder.getContent()),
      null, [{ type: 'col' }])).toBeUndefined();
  });
});
