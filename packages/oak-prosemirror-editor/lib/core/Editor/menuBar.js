import { toggleMark } from 'prosemirror-commands';

import { marks } from './schema';

export default ({ state, setState }) => {
  const applyMark_ = () => {
    toggleMark(marks.strong)(state, setState);
  };

  return (<button onClick={applyMark_.bind(null)}>Bold</button>);
};
