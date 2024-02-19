export declare type EmitterCallback = (...args: any[]) => void;

export declare class Emitter {
  constructor();

  /** Subscribes to events and return an unsubscribe callback */
  subscribe(cb: EmitterCallback): EmitterCallback;

  /** Emits an event */
  emit(eventName: string, ...args: any[]): void;
}
