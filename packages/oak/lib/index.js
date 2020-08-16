import React, { createRef } from 'react';
import ReactDOM from 'react-dom';

import App from './core/App';

class oak {
  #ref = createRef()

  addGroup (...args) {
    this.ref.current?.addGroup(...args);
  }

  removeGroup (...args) {
    this.ref.current?.removeGroup(...args);
  }
}

export const render = (elmt, options = {}) => {
  const app = new oak();
  ReactDOM.render(<App ref={app.ref} {...options} />, elmt);
  return app;
};

export default { render };
