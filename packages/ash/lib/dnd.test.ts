import { Builder, type ElementObject } from '@oakjs/core';

import { baseAddon } from './addons';
import { buildTree, getAncestors, isSameOrDescendant } from './tree';
import {
  addStructuralChild,
  canDrop,
  commitDrop,
  getClosestStructuralOwner,
  getDefaultInsertTarget,
} from './dnd';

const getBuilder = (content: ElementObject[], addons: any[] = []) => {
  let id = 0;

  return new Builder({
    addons: [baseAddon() as any, ...addons],
    content,
    options: { generateId: () => String(id++) },
  });
};

const content = (): ElementObject[] => [
  { id: 'row', type: 'row', cols: [
    { id: 'col1', type: 'col', content: [
      { id: 'title', type: 'title', content: 'Title' },
      { id: 'text', type: 'text', content: 'Text' },
    ] },
    { id: 'col2', type: 'col', content: [] },
  ] },
  { id: 'clickable', type: 'clickable', content: [] },
  { id: 'foldable', type: 'foldable', content: [], seeMore: [], seeLess: [] },
];

describe('tree', () => {
  it('should index every element with its container', () => {
    const builder = getBuilder(content());
    const tree = buildTree(builder, builder.getContent());

    expect([...tree.nodes.keys()]).toEqual([
      'row', 'col1', 'title', 'text', 'col2', 'clickable', 'foldable',
    ]);
    expect(tree.nodes.get('text')).toMatchObject({
      index: 1, depth: 2, containerKey: 'content',
    });
    expect(tree.nodes.get('col2').containerKey).toBe('cols');
    expect(tree.nodes.get('foldable').containers.map(c => c.key))
      .toEqual(['content', 'seeMore', 'seeLess']);
    expect(getAncestors(tree, 'text').map(n => n.id)).toEqual(['row', 'col1']);
    expect(isSameOrDescendant(tree, 'row', 'text')).toBe(true);
    expect(isSameOrDescendant(tree, 'col2', 'text')).toBe(false);
  });
});

describe('dnd', () => {
  it('should validate drop targets', () => {
    const builder = getBuilder(content());
    const tree = buildTree(builder, builder.getContent());
    const row = tree.nodes.get('row');
    const col1 = tree.nodes.get('col1');
    const clickable = tree.nodes.get('clickable');
    const textSource = { type: 'element' as const, id: 'text' };

    // Inside another container
    expect(canDrop(builder, tree, textSource, {
      container: (clickable.element.content as ElementObject[]), owner: clickable.element,
    })).toBe(true);

    // Not between columns
    expect(canDrop(builder, tree, textSource, {
      container: row.element.cols, owner: row.element,
    })).toBe(false);

    // Columns can only be reordered inside their row
    expect(canDrop(builder, tree, { type: 'element', id: 'col2' }, {
      container: row.element.cols, owner: row.element,
    })).toBe(true);
    expect(canDrop(builder, tree, { type: 'element', id: 'col2' }, {
      container: builder.getContent(), owner: null,
    })).toBe(false);
    expect(canDrop(builder, tree, { type: 'component', componentId: 'col' }, {
      container: builder.getContent(), owner: null,
    })).toBe(false);

    // Not inside itself
    expect(canDrop(builder, tree, { type: 'element', id: 'row' }, {
      container: (col1.element.content as ElementObject[]), owner: col1.element,
    })).toBe(false);

    // Disallowed children
    expect(canDrop(
      builder, tree, { type: 'component', componentId: 'clickable' },
      { container: (clickable.element.content as ElementObject[]), owner: clickable.element },
    )).toBe(false);
  });

  it('should respect overrides', () => {
    const builder = getBuilder(content(), [{
      overrides: [
        { type: 'component', targets: ['foldable'], droppable: false },
        { type: 'component', targets: ['clickable'], disallow: ['title'] },
      ],
    }]);
    const tree = buildTree(builder, builder.getContent());
    const foldable = tree.nodes.get('foldable');
    const clickable = tree.nodes.get('clickable');

    expect(canDrop(builder, tree, { type: 'element', id: 'text' }, {
      container: (foldable.element.content as ElementObject[]), owner: foldable.element,
    })).toBe(false);
    expect(canDrop(builder, tree, { type: 'element', id: 'title' }, {
      container: (clickable.element.content as ElementObject[]), owner: clickable.element,
    })).toBe(false);
    expect(canDrop(builder, tree, { type: 'element', id: 'text' }, {
      container: (clickable.element.content as ElementObject[]), owner: clickable.element,
    })).toBe(true);
  });

  it('should move elements', () => {
    const builder = getBuilder(content());
    let tree = buildTree(builder, builder.getContent());
    const col1 = tree.nodes.get('col1');
    const col2 = tree.nodes.get('col2');

    // Reorder inside the same container
    commitDrop(builder, tree, { type: 'element', id: 'text' }, {
      container: (col1.element.content as ElementObject[]),
      owner: col1.element,
      containerKey: 'content',
      index: 0,
    });
    expect((col1.element.content as ElementObject[]).map((e: ElementObject) => e.id))
      .toEqual(['text', 'title']);

    // Move into an empty container
    tree = buildTree(builder, builder.getContent());
    commitDrop(builder, tree, { type: 'element', id: 'title' }, {
      container: (col2.element.content as ElementObject[]),
      owner: col2.element,
      containerKey: 'content',
      index: 0,
    });
    expect((col2.element.content as ElementObject[]).map((e: ElementObject) => e.id))
      .toEqual(['title']);

    // Move at the end of the root container
    tree = buildTree(builder, builder.getContent());
    commitDrop(builder, tree, { type: 'element', id: 'text' }, {
      container: builder.getContent(),
      owner: null,
      containerKey: 'root',
      index: builder.getContent().length,
    });
    expect(builder.getContent().map(e => e.id))
      .toEqual(['row', 'clickable', 'foldable', 'text']);
    expect((col1.element.content as ElementObject[])).toEqual([]);
  });

  it('should insert new components at an index in one history entry', () => {
    const builder = getBuilder(content());
    builder.resetHistory();
    const tree = buildTree(builder, builder.getContent());

    const added = commitDrop(
      builder, tree, { type: 'component', componentId: 'button' }, {
        container: builder.getContent(),
        owner: null,
        containerKey: 'root',
        index: 1,
      },
    );

    expect(builder.getContent()[1]).toBe(added);
    expect(added.type).toBe('button');

    builder.undo();
    expect(builder.getContent().map(e => e.type))
      .toEqual(['row', 'clickable', 'foldable']);
  });

  it('should find a default insert target', () => {
    const builder = getBuilder(content());
    const tree = buildTree(builder, builder.getContent());

    // Nothing selected: end of page
    expect(getDefaultInsertTarget(builder, tree, 'title', null))
      .toMatchObject({ owner: null, index: 3 });

    // Container selected: inside it
    expect(getDefaultInsertTarget(builder, tree, 'title', 'col2'))
      .toMatchObject({ owner: tree.nodes.get('col2').element, index: 0 });

    // Element selected: right after it
    expect(getDefaultInsertTarget(builder, tree, 'title', 'title'))
      .toMatchObject({ owner: tree.nodes.get('col1').element, index: 1 });

    // Disallowed inside the selected element: after it
    expect(getDefaultInsertTarget(builder, tree, 'clickable', 'clickable'))
      .toMatchObject({ owner: null, index: 2 });
  });

  it('should add columns to the closest row', () => {
    const builder = getBuilder(content());
    const tree = buildTree(builder, builder.getContent());

    expect(getClosestStructuralOwner(builder, tree, 'clickable')).toBeNull();

    const { node, container } = getClosestStructuralOwner(
      builder, tree, 'text'
    );
    expect(node.id).toBe('row');
    expect(container.key).toBe('cols');

    const first = addStructuralChild(builder, container, 'before');
    const last = addStructuralChild(builder, container, 'after');

    expect(node.element.cols.map((c: ElementObject) => c.id))
      .toEqual([first.id, 'col1', 'col2', last.id]);
    expect(first.type).toBe('col');
    expect(first.content).toEqual([]);
  });
});
