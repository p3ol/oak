export default class Logger {
  #builder = null;

  constructor ({ builder }) {
    this.#builder = builder;
  }

  log (...args) {
    if (this.#builder.options.debug) {
      // eslint-disable-next-line no-console
      console.log('[oak]', ...args);
    }
  }
}
