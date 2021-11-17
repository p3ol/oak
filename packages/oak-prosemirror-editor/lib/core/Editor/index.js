import { ProseMirror, useProseMirror } from 'use-prosemirror';
import { DOMParser, DOMSerializer } from 'prosemirror-model';
import { setBlockType, baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';

import { schema } from './schema';
import MenuBar from './menuBar';
import { toggleMark } from './transform';

export default ({ value, onChange }) => {

  const content = document.createElement('div');
  content.innerHTML = value;

  const [state, setState] = useProseMirror({
    schema,
    doc: DOMParser.fromSchema(schema).parse(content),
    docFormat: 'html',
    plugins: [
      keymap(baseKeymap),
    ],
  });

  const onChange_ = value => {
    setState(value);
    onChange({ value: toHTML(value) });
  };

  const toHTML = value => {
    const div = document.createElement('div');
    const fragment = DOMSerializer
      .fromSchema(schema)
      .serializeFragment(value.doc.content);
    div.appendChild(fragment);

    return div.innerHTML;
  };

  const onToggleMark = (mark_, attr = {}) => {
    toggleMark(mark_, attr)(state, tr => onChange_(state.apply(tr)));
  };

  const onToggleBlock = (attr = {}) => {
    const transformation = setBlockType(schema.nodes.paragraph, attr);
    transformation(state, tr => onChange_(state.apply(tr)));
  };

  return (
    <>
      <MenuBar
        state={state}
        onToggleBlock={onToggleBlock}
        onToggleMark={onToggleMark}
      />
      <ProseMirror state={state} onChange={onChange_} />
    </>
  );
};
