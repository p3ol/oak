import { useEffect, useRef, useState } from 'react';
import { DOMParser as proseDOMParser, DOMSerializer } from 'prosemirror-model';
import { setBlockType, baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';

import { useProseMirror } from '../../hooks';
import { schema } from './schema';
import { removeActiveMark, toggleMark, updateActiveLink } from './transform';
import { SIZES } from './utils';
import ProseMirror from '../ProseMirror';
import Toolbar from './Toolbar';

export default ({ value, onChange, element, options = {} }) => {
  const viewRef = useRef();
  const [size, setSize] = useState(SIZES.text);
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
    const size = element?.type === 'title'
      ? SIZES.headings[element?.headingLevel] : SIZES.text;
    schema.marks.size.attrs.size.default = `${size}px`;
    setSize(size);
  }, [element?.headingLevel]);

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
      updateActiveLink(attr, viewRef)(state, tr => onChange_(state.apply(tr)));
    } else {
      removeActiveMark(schema.marks.link)(state, tr => {
        const transitionState = state.apply(tr);
        viewRef.current.view.updateState(transitionState);

        if (attr.href !== '' && attr.href !== null) {
          const newLink = toggleMark(schema.marks.link, attr);
          newLink(transitionState, t => onChange_(transitionState.apply(t)));
        } else {
          onChange_(transitionState);
        }
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
        defaultSize={size}
        dispatch={tr => onChange_(state.apply(tr))}
      />
      <ProseMirror
        className="oak-text-editable"
        ref={viewRef}
        state={state}
        onChange={onChange_}
        style={{ fontSize: getDefaultSize() }}
      />
      {options.debug && (
        <pre>{JSON.stringify(state)}</pre>
      )}
    </div>
  );
};
