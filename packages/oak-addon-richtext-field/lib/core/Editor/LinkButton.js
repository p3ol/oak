import { useEffect, useReducer } from 'react';
import { useSlate } from 'slate-react';
import { Editor, Element, Transforms } from 'slate';
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

import { isBlockActive, toggleLink } from './editor';

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

  const unwrapLink = editor => {
    Transforms.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
    });
  };

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

    if (isBlockActive(editor, 'link')) {
      unwrapLink(editor);
    }

    toggleLink(editor, name, field.value);
  };

  const onClick = () => {
    dispatch({ link: Editor.marks(editor)?.link });
    Transforms.select(editor, state.selection);
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
              // {
              //   'oak-active': isMarkActive(editor, 'link'),
              // },
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
