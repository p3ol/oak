import { useEffect, useRef, useState } from 'react';
import { ProseMirror, useProseMirror } from 'use-prosemirror';
import { DOMParser as proseDOMParser, DOMSerializer } from 'prosemirror-model';
import { setBlockType, baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { classNames } from '@poool/junipero';

import { schema } from './schema';
import { removeActiveMark, toggleMark, updateActiveLink } from './transform';
import Toolbar from './Toolbar';
import { SIZES } from './utils';

export default ({ value, onChange, element }) => {

  const viewRef = useRef();
  const [editorView, setEditorView] = useState(null);

  const content = document.createElement('div');
  content.innerHTML = value;

  const [state, setState] = useProseMirror({
    schema,
    doc: proseDOMParser.fromSchema(schema)
      .parse(new DOMParser().parseFromString(value, 'text/html')),
    docFormat: 'html',
    plugins: [
      keymap(baseKeymap),
    ],
  });

  useEffect(() => {
    setEditorView(viewRef.current.view);
  }, [viewRef]);

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
    const inner = div.innerHTML;
    div.remove();

    return inner;
  };

  const getDefaultSize = () => {
    return element?.type === 'title'
      ? SIZES.headings[element?.headingLevel] || SIZES.text
      : SIZES.text;
  };

  const onToggleMark = (mark, attr = {}) => {
    toggleMark(mark, attr)(state, tr => onChange_(state.apply(tr)));
  };

  const onToggleBlock = (node, attr = {}) => {
    const transformation = setBlockType(node, attr);
    transformation(state, tr => onChange_(state.apply(tr)));
  };

  const onToggleLink = (attr = {}) => {
    const { empty } = state.selection;

    if (empty) {
      updateActiveLink(state, attr);
    } else {
      removeActiveMark(schema.marks.link)(state, tr => {
        const transitionState = state.apply(tr);
        editorView.updateState(transitionState);
        const newLink = toggleMark(schema.marks.link, attr);
        newLink(transitionState, tra => onChange_(transitionState.apply(tra)));
      });
    }
  };

  return (
    <div className="oak-text-editor oak-prosemirror">
      <Toolbar
        state={state}
        onToggleBlock={onToggleBlock}
        onToggleMark={onToggleMark}
        onToggleLink={onToggleLink}
        defaultSize={getDefaultSize()}
        dispatch={tr => onChange_(state.apply(tr))}
      />
      <ProseMirror
        className="oak-text-input"
        ref={viewRef}
        state={state}
        onChange={onChange_}
        style={{ fontSize: getDefaultSize() }}
      />
    </div>
  );
};
