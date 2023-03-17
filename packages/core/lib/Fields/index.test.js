import Fields from './index';

describe('Fields', () => {
  it('should allow to manage fields', () => {
    const cb = jest.fn();
    const fields = new Fields();
    fields.subscribe(cb);

    const field = { type: 'test' };

    fields.add(field);
    expect(fields.get('test')).toBe(field);
    expect(cb).toHaveBeenCalledWith('fields.add', fields, field);
  });
});
