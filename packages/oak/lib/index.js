import { createRef } from 'react';
import ReactDOM from 'react-dom';

import App from './core/App';
import Text from './core/Text';

class oak {
  #ref = createRef();
  #parent = null;
  #ready = false;
  #callsQueue = [];

  constructor (parent) {
    this.#parent = parent;
  }

  setRef (ref) {
    this.#ref.current = ref;
  }

  setReady () {
    if (this.#ready) {
      return;
    }

    this.#ready = true;
    this.#callsQueue.forEach(cb => cb());
    this.#callsQueue = undefined;
  }

  #ensureMethod (method) {
    if (!this.#ready) {
      this.#callsQueue.push(method);
    } else {
      method();
    }
  }

  addGroup (...args) {
    this.#ensureMethod(() => {
      this.#ref.current?.addGroup(...args);
    });

    return this;
  }

  removeGroup (...args) {
    this.#ensureMethod(() => {
      this.#ref.current?.removeGroup(...args);
    });

    return this;
  }

  setContent (...args) {
    this.#ensureMethod(() => {
      this.#ref.current?.setContent(...args);
    });

    return this;
  }

  addElement (...args) {
    this.#ensureMethod(() => {
      this.#ref.current?.addElement(...args);
    });

    return this;
  }

  removeElement (...args) {
    this.#ensureMethod(() => {
      this.#ref.current?.removeElement(...args);
    });

    return this;
  }

  setElement (...args) {
    this.#ensureMethod(() => {
      this.#ref.current?.setElement(...args);
    });

    return this;
  }

  undo (...args) {
    this.#ensureMethod(() => {
      this.#ref.current?.undo(...args);
    });
  }

  redo (...args) {
    this.#ensureMethod(() => {
      this.#ref.current?.redo(...args);
    });
  }

  isUndoPossible () {
    if (!this.#ready) {
      return false;
    }

    return this.#ref.current?.isUndoPossible();
  }

  isRedoPossible () {
    if (!this.#ready) {
      return false;
    }

    return this.#ref.current?.isRedoPossible();
  }

  setTexts (...args) {
    this.#ensureMethod(() => {
      this.#ref.current?.setTexts(...args);
    });

    return this;
  }

  getText (...args) {
    if (!this.#ready) {
      return null;
    }

    return this.#ref.current?.getText(...args);
  }

  setOverrides (...args) {
    this.#ensureMethod(() => {
      this.#ref.current?.setOverrides(...args);
    });

    return this;
  }

  setOptions (...args) {
    this.#ensureMethod(() => {
      this.#ref.current?.setOptions(...args);
    });

    return this;
  }

  destroy () {
    ReactDOM.unmountComponentAtNode(this.#parent);
  }
}

export const render = (elmt, options = {}) => {
  const app = new oak(elmt);

  ReactDOM.render((
    <App
      options={options}
      onReady={app.setReady.bind(app)}
      ref={app.setRef.bind(app)}
    />
  ), elmt);

  return app;
};

export { Text, oak as Lib };

export { useOptions, useBuilder, useElement } from './hooks';

export { sanitizeHTML } from './utils';

export { default as localeFr } from './languages/fr';
