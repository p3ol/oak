import React from 'react';
import ReactDOM from 'react-dom';

import App from './core/App';

export const render = (elmt, options = {}) => {
  ReactDOM.render(<App {...options} />, elmt);
};

export default { render };
