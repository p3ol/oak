import { useMemo, useCallback, useReducer, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { mockState } from '@poool/junipero-utils';

import Element from './Element';
import Leaf from './Leaf';
import { withHtml } from './html';

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
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        className="oak-text-editor"
      />
    </Slate>
  );
};
