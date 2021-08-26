import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { mockState } from '@poool/junipero-utils';
import { createEditor, Editor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';
import isHotkey from 'is-hotkey';
import { Text } from '@poool/oak';

import { toggleMark, withHtml } from './editor';
import { isSerialized, deserialize } from './html';
import BlockButton from './BlockButton';
import Element from './Element';
import Leaf from './Leaf';
import ColorButton from './ColorButton';
import MarkButton from './MarkButton';
import SizeButton from './SizeButton';
import LinkButton from './LinkButton';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

const SIZES = {
  text: 16,
  headings: { h1: 32, h2: 24, h3: 19, h4: 16, h5: 13, h6: 10 },
};

export default ({
  value,
  onChange,
  element,
}) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => (
    withHtml(withHistory(withReact(createEditor())))
  ), []);
  const [state, dispatch] = useReducer(mockState, {
    value: (isSerialized(value) ? deserialize(value) : value) ||
      [{ children: [{ text: '' }] }],
  });

  useEffect(() => {
    if (value) {
      dispatch({ value: isSerialized(value) ? deserialize(value) : value });
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

  const getDefaultSize = () =>
    element?.type === 'title'
      ? SIZES.headings[element.headingLevel] || SIZES.text
      : SIZES.text;

  const getTextSize = () => {
    const selectedSize = parseInt(Editor.marks(editor)?.size?.split('p')[0]);

    return selectedSize || getDefaultSize();
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
            tooltipText={(
              <Text
                name="addons.richtextField.fields.editor.bold"
                default="Bold"
              />
            )}
          />
          <MarkButton
            format="italic"
            icon="format_italic"
            tooltipText={(
              <Text
                name="addons.richtextField.fields.editor.italic"
                default="Italic"
              />
            )}
          />
          <MarkButton
            format="underline"
            icon="format_underlined"
            tooltipText={(
              <Text
                name="addons.richtextField.fields.editor.underline"
                default="Underline"
              />
            )}
          />
          <LinkButton />
          <ColorButton />
          <SizeButton
            icon="horizontal_rule"
            increase={false}
            currentSize={getTextSize()}
            tooltipText={(
              <Text
                name="addons.richtextField.fields.editor.decrease"
                default="Decrease size"
              />
            )}
          />
          <span className="oak-text-size">{ getTextSize() }</span>
          <SizeButton
            icon="add"
            currentSize={getTextSize()}
            tooltipText={(
              <Text
                name="addons.richtextField.fields.editor.increase"
                default="Increase size"
              />
            )}
          />
          <BlockButton
            format="text-left"
            icon="format_align_left"
            tooltipText={(
              <Text
                name="addons.richtextField.fields.editor.left"
                default="Align left"
              />
            )}
          />
          <BlockButton
            format="text-center"
            icon="format_align_center"
            tooltipText={(
              <Text
                name="addons.richtextField.fields.editor.center"
                default="Align center"
              />
            )}
          />
          <BlockButton
            format="text-right"
            icon="format_align_right"
            tooltipText={(
              <Text
                name="addons.richtextField.fields.editor.right"
                default="Align right"
              />
            )}
          />
          <BlockButton
            format="text-justify"
            icon="format_align_justify"
            tooltipText={(
              <Text
                name="addons.richtextField.fields.editor.justify"
                default="Justify"
              />
            )}
          />
        </div>
        <Editable
          onDrop={e => e.preventDefault()}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck={false}
          onKeyDown={onKeyDown}
          className="oak-text-editable"
          style={{ fontSize: getDefaultSize() }}
        />
      </div>
    </Slate>
  );
};
