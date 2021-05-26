import { useMemo, useCallback, useReducer, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { mockState } from '@poool/junipero-utils';

import { withHtml } from './html';
import Element from './Element';
import Leaf from './Leaf';
import MarkButton from './MarkButton';

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
    onChange?.({ value: val });
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
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          className="oak-text-editable"
        />
      </div>
    </Slate>
  );
};
