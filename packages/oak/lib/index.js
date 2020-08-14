import React from 'preact';

export const render = (elmt, options = {}) => {
  React.render(<App {...options} />, elmt);
};
