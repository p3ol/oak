import { classNames } from '@poool/junipero';
import { mockState } from '@poool/junipero-utils';
import isHotkey from 'is-hotkey';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';

import { toggleMark, withHtml } from './editor';
import Element from './Element';
import Leaf from './Leaf';
import MarkButton from './MarkButton';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

export default ({
  value,
  onChange,
}) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => (
    withHtml(withHistory(withReact(createEditor())))
  ), []);
  const [state, dispatch] = useReducer(mockState, {
    value: value || [{ children: [{ text: '' }] }],
  });

  useEffect(() => {
    if (value) {
      dispatch({ value });
    }
  }, [value]);

  const onChange_ = val => {
    dispatch({ value: val });
  };

  const onKeyDown = e => {
    Object.entries(HOTKEYS).forEach(([key, mark]) => {
      if (isHotkey(key, e)) {
        e.preventDefault();
        toggleMark(editor, mark);
      }
    });
  };

  const updateValue = e => {
    e.preventDefault();
    onChange?.({ value: state.value });
  };

  return (
    <Slate
      editor={editor}
      value={state.value}
      onChange={onChange_}
    >
      <div className="oak-text-editor">
        <div className="oak-toolbar">
          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underlined" />
        </div>
        <Editable
          onDrop={e => e.preventDefault()}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck={false}
          onKeyDown={onKeyDown}
          className="oak-text-editable"
        />
      </div>
      <div className="oak-text-editor-flex">
        <a onClick={updateValue}
          className={classNames('oak-validate')}
        >
          Save
        </a>
      </div>
    </Slate>
  );
};
