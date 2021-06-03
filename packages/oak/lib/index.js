import { createRef } from 'react';
import ReactDOM from 'react-dom';

import { useOptions, useBuilder, useElement } from './hooks';
import App from './core/App';

class oak {
  #ref = createRef()

  addGroup (...args) {
    this.#ref.current?.addGroup(...args);

    return this;
  }

  removeGroup (...args) {
    this.#ref.current?.removeGroup(...args);

    return this;
  }

  setContent (...args) {
    this.#ref.current?.setContent(...args);

    return this;
  }

  addElement (...args) {
    this.#ref.current?.addElement(...args);

    return this;
  }

  removeElement (...args) {
    this.#ref.current?.removeElement(...args);

    return this;
  }

  setElement (...args) {
    this.#ref.current?.setElement(...args);

    return this;
  }
}

export const render = (elmt, options = {}) => {
  const app = new oak();
  ReactDOM.render(<App ref={app.ref} {...options} />, elmt);

  return app;
};

export { useOptions, useBuilder, useElement };
