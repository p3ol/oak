import { Transform } from 'prosemirror-transform';
import { DOMParser, Mark } from 'prosemirror-model';
import { ProseMirror, useProseMirror } from 'use-prosemirror';

import { schema } from './schema';
import MenuBar from './menuBar';
import { toggleMark } from './transform';

export default ({ value }) => {

  const test = document.createElement('div');
  test.innerHTML = value;

  const [state, setState] = useProseMirror({
    schema,
    doc: DOMParser.fromSchema(schema).parse(test),
    docFormat: 'html',
  });

  const onToggleMark = (mark_, attr = {}) => {
    toggleMark(mark_, attr)(state, tr => setState(state.apply(tr)));
  };

  return (
    <>
      <MenuBar onToggle={onToggleMark} />
      <ProseMirror state={state} onChange={setState} />
    </>
  );
};
