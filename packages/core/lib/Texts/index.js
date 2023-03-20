import Emitter from '../Emitter';

export default class Texts extends Emitter {
  #texts = {};

  get (key, def) {
    // TODO: add real texts support
    return this.#texts[key] || def;
  }
}
