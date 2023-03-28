export declare class Emitter {
  constructor();

  /** Subscribes to events and return an unsubscribe callback */
  subscribe(cb: Function): Function;

  /** Emits an event */
  emit(eventName: string, ...args: any[]): void;
}
