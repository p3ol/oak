import type { EmitterCallback } from '../types';

export declare abstract class IEmitter {
  constructor();

  /** Subscribes to events and return an unsubscribe callback */
  subscribe(cb: EmitterCallback): EmitterCallback;

  /** Emits an event */
  emit(eventName: string, ...args: any[]): void;
}

export default class Emitter implements IEmitter {
  #subscribers: Map<symbol, Function> = new Map();

  subscribe (cb: Function) {
    const key = Symbol('store-subscriber');
    this.#subscribers.set(key, cb);

    return () => { this.#subscribers.delete(key); };
  }

  emit (...args: any[]) {
    this.#subscribers.forEach(c => c.bind(this)(...args));
  }
}
