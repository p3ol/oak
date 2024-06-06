import type Builder from '../Builder';

export declare abstract class ILogger {
  constructor(options?: { builder: Builder });
  log(...args: any[]): void;
  warn(...args: any[]): void;
}

export default class Logger implements ILogger {
  #builder: Builder = null;

  constructor ({ builder }: { builder?: Builder }) {
    this.#builder = builder;
  }

  log (...args: any[]) {
    if (this.#builder.options.debug) {
      // eslint-disable-next-line no-console
      console.log('[oak]', ...args);
    }
  }

  warn (...args: any[]) {
    console.warn('[oak]', ...args);
  }
}
