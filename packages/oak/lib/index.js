import { createRef } from 'react';
import ReactDOM from 'react-dom';

import App from './core/App';
import Text from './core/Text';

class oak {
  #ref = createRef();
  #parent = null;

  constructor (parent) {
    this.#parent = parent;
  }

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

  isUndoPossible () {
    return this.#ref.current?.isUndoPossible();
  }

  isRedoPossible () {
    return this.#ref.current?.isRedoPossible();
  }

  setTexts (...args) {
    return this.#ref.current?.setTexts(...args);
  }

  getText (...args) {
    return this.#ref.current?.getText(...args);
  }

  setOverrides (...args) {
    return this.#ref.current?.setOverrides(...args);
  }

  destroy () {
    ReactDOM.unmountComponentAtNode(this.#parent);
  }
}

export const render = (elmt, options = {}) => {
  const app = new oak(elmt);
  ReactDOM.render(<App ref={app.setRef.bind(app)} {...options} />, elmt);

  return app;
};

export { Text, oak as Lib, App as Builder };

export { useOptions, useBuilder, useElement } from './hooks';

export { sanitizeHTML } from './utils';

export { default as localeFr } from './languages/fr';
