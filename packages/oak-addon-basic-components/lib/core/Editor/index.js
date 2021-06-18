import { classNames } from '@poool/junipero';
import { mockState } from '@poool/junipero-utils';
import isHotkey from 'is-hotkey';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';

import { toggleMark, withHtml } from './editor';
import BlockButton from './BlockButton';
import Element from './Element';
import Leaf from './Leaf';
import ColorButton from './ColorButton';
import MarkButton from './MarkButton';
import SizeButton from './SizeButton';

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
    onChange?.({ value: val });
  };

  const onKeyDown = e => {
    Object.entries(HOTKEYS).forEach(([key, mark]) => {
      if (isHotkey(key, e)) {
        e.preventDefault();
        toggleMark(editor, mark);
      }
    });
  };

  const getTextSize = () => {
    const path = editor.selection?.anchor?.path;
    const selectedRow = editor.children[path?.[0]];
    const selectedContent = Array.isArray(selectedRow)
      ? selectedRow[path?.[1]]
      : selectedRow?.children?.[path?.[1]];
    const selectedSize = parseInt(selectedContent?.size?.split('p')[0]);

    return selectedSize || 14;
  };

  return (
    <Slate
      editor={editor}
      value={state.value}
      onChange={onChange_}
    >
      <div className="oak-text-editor">
        <div className="oak-toolbar">
          <MarkButton
            format="bold"
            icon="format_bold"
            tooltipText="Bold"
          />
          <MarkButton
            format="italic"
            icon="format_italic"
            tooltipText="Italic"
          />
          <MarkButton
            format="underline"
            icon="format_underlined"
            tooltipText="Underline"
          />
          <ColorButton />
          <SizeButton
            icon="horizontal_rule"
            increase={false}
            currentSize={getTextSize()}
            tooltipText="Decrease size"
          />
          <span className="oak-text-size">{ getTextSize() }</span>
          <SizeButton
            icon="add"
            currentSize={getTextSize()}
            tooltipText="Increase size"
          />
          <BlockButton
            format="text-left"
            icon="format_align_left"
            tooltipText="Align left"
          />
          <BlockButton
            format="text-center"
            icon="format_align_center"
            tooltipText="Align center"
          />
          <BlockButton
            format="text-right"
            icon="format_align_right"
            tooltipText="Align right"
          />
          <BlockButton
            format="text-justify"
            icon="format_align_justify"
            tooltipText="Align justify"
          />
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
    </Slate>
  );
};
