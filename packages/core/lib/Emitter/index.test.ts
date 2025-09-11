import { vi } from 'vitest';

import Emitter from './index';

describe('Emitter', () => {
  it('should subscribe to and emit events', () => {
    const emitter = new Emitter();
    const cb = vi.fn();
    const unsubscribe = emitter.subscribe(cb);

    emitter.emit({ foo: 'bar' });

    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ foo: 'bar' }));

    unsubscribe();
    emitter.emit({ foo: 'baz' });

    expect(cb).toHaveBeenCalledTimes(1);
  });
});
