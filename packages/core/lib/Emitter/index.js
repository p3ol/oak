export default class Emitter {
  #subscribers = new Map();

  subscribe (cb) {
    const key = Symbol('store-subscriber');
    this.#subscribers.set(key, cb);

    return () => this.#subscribers.delete(key);
  }

  emit (...args) {
    this.#subscribers.forEach(c => c.bind(this)(...args));
  }
}
