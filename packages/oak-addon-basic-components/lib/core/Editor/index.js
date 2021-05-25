import { useMemo, useReducer, useEffect } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { mockState } from '@poool/junipero-utils';

export default ({
  value,
  onChange,
}) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [state, dispatch] = useReducer(mockState, {
    value: typeof value === 'string' ? [{
      type: 'paragraph',
      children: [{ text: value }],
    }] : value || [],
  });

  useEffect(() => {
    if (value) {
      dispatch({
        value: typeof value === 'string' ? [{
          type: 'paragraph',
          children: [{ text: value }],
        }] : value || [],
      });
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
      <Editable />
    </Slate>
  );
};
