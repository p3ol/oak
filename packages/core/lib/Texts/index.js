import { get } from '@junipero/core';

import Emitter from '../Emitter';

export default class Texts extends Emitter {
  #texts = {};

  get (key, def) {
    // TODO: add real texts support
    if (typeof key === 'function') {
      return key((k, d) => get(this.#texts, k, d));
    }

    if (typeof key !== 'string') return def ?? key;

    return get(this.#texts, key, def ?? key);
  }
}
