import { createRef } from 'react';
import ReactDOM from 'react-dom';

import { useOptions, useBuilder, useElement } from './hooks';
import App from './core/App';

class oak {
  #ref = createRef()

  setRef (ref) {
    this.#ref.current = ref;
  }

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

  undo (...args) {
    this.#ref.current?.undo(...args);
  }

  redo (...args) {
    this.#ref.current?.redo(...args);
  }
}

export const render = (elmt, options = {}) => {
  const app = new oak();
  ReactDOM.render(<App ref={app.setRef.bind(app)} {...options} />, elmt);

  return app;
};

export { useOptions, useBuilder, useElement };
