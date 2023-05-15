import Components from './index';

describe('Components', () => {
  it('should allow to manage components', () => {
    const cb = jest.fn();
    const components = new Components();
    components.subscribe(cb);

    const component = { id: 'test' };

    components.add(component);
    expect(components.getComponent('test'))
      .toMatchObject(component);

    expect(cb).toHaveBeenCalledWith(
      'components.add',
      expect.objectContaining(component),
      expect.objectContaining({ id: 'other' })
    );
  });

  it('should allow to add a new group and add components', () => {
    const cb = jest.fn();
    const components = new Components();
    components.subscribe(cb);

    const group = { id: 'test', type: 'group' };
    const component = { id: 'test', group: 'test' };

    components.add(group);
    expect(cb).toHaveBeenCalledWith(
      'groups.add',
      expect.objectContaining(group)
    );
    expect(components.getGroup('test')).toMatchObject(group);

    components.add(component);
    expect(cb).toHaveBeenCalledWith(
      'components.add',
      expect.objectContaining(component),
      expect.objectContaining(group)
    );
    expect(components.getComponent('test')).toMatchObject(component);

    expect(components).toMatchSnapshot();
  });
});
