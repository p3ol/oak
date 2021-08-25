import { useEffect, useReducer } from 'react';
import { useSlate } from 'slate-react';
import { Editor, Transforms } from 'slate';
import {
  TextField,
  ToggleField,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Tooltip,
  classNames,
  mockState,
  exists,
} from '@poool/junipero';
import { Text } from '@poool/oak';

import { isMarkActive, toggleMark } from './editor';

export default ({ className }) => {
  const editor = useSlate();
  const [state, dispatch] = useReducer(mockState, {
    selection: editor.selection,
    link: '',
    target: '',
  });

  useEffect(() => {
    if (!editor || !editor.selection) {
      return;
    }

    dispatch({ selection: editor.selection });
  }, [editor.selection]);

  const onChange = (name, field) => {
    if (!state.selection) {
      return;
    }

    Transforms.select(editor, state.selection);
    dispatch({
      [name]: exists(field.checked)
        ? field.checked
          ? field.value
          : null
        : field.value,
    });
    toggleMark(editor, name, field.value);
  };

  const onClick = () => {
    console.log(Editor.marks(editor));
    if (Editor.marks(editor)?.link) {
      Transforms.select(editor, Editor.first(editor, state.selection)[1]);
    } else {
      Transforms.move(editor, { distance: 1, unit: 'word' });
    }

    // Transforms.select(editor, Editor.first(editor, state.selection)[1]);
    dispatch({ link: getCurrentLink() });
    // Transforms.select(editor, state.selection);
  };

  const getCurrentLink = () => {
    const path = state.selection?.anchor?.path;
    const selectedRow = editor.children[path?.[0]];
    const selectedContent = Array.isArray(selectedRow)
      ? selectedRow[path?.[1]]
      : selectedRow?.children?.[path?.[1]];

    return selectedContent?.link || '';
  };

  return (
    <Dropdown className="oak-link-field">
      <DropdownToggle tag="span">
        <Tooltip text={(
          <Text
            name="addons.richtextField.fields.editor.link"
            default="Link"
          />
        )}
        >
          <a
            href="#"
            onClick={onClick}
            className={classNames(
              'oak-toolbar-button',
              'oak-link',
              {
                'oak-active': isMarkActive(editor, 'link'),
              },
              className,
            )}
          >
            <i className="oak-icons">
              format_bold
            </i>
          </a>
        </Tooltip>
      </DropdownToggle>
      <DropdownMenu>
        <TextField
          placeholder
          value={state.link}
          onChange={onChange.bind(null, 'link')}
        />
        <ToggleField
          checkedLabel="Open in new window"
          uncheckedLabel="Open in new window"
          checked={state.target === '_blank'}
          onChange={onChange.bind(null, 'target')}
          value="_blank"
        />
      </DropdownMenu>
    </Dropdown>
  );
};
