import { vi } from 'vitest';

import Fields from './index';

describe('Fields', () => {
  it('should allow to manage fields', () => {
    const cb = vi.fn();
    const fields = new Fields();
    fields.subscribe(cb);

    const field = { type: 'test' };

    fields.add(field);
    expect(cb).toHaveBeenCalledWith(
      'fields.add', fields, expect.objectContaining(field));
    expect(fields.all()).toMatchSnapshot('With custom field');

    fields.remove('test');
    expect(fields.get('test')).toBeUndefined();
    expect(cb).toHaveBeenCalledWith(
      'fields.remove', fields, expect.objectContaining(field));
    expect(fields.all()).toMatchSnapshot('Without custom field');
  });
});
