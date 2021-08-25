import { useEffect, useReducer } from 'react';
import { useSlate } from 'slate-react';
import { Editor, Element, Transforms, Range, Operation } from 'slate';
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
    target: null,
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

    const url = name === 'link' ? field.value : state.link;
    const target = name === 'target'
      ? field.checked ? field.value : null : state.target;

    if (isBlockActive(editor, 'link')) {
      const { selection } = editor;

      if (selection && Range.isCollapsed(selection)) {
        if (url !== '') {
          Transforms.setNodes(editor, { url, target }, {
            match: n => !Editor.isEditor(n) && Element.isElement(n) &&
            n.type === 'link',
          });
        } else {
          unwrapLink(editor);
        }

        return;
      }

      unwrapLink(editor);
    }

    toggleLink(editor, { url, target });
  };

  const onClick = () => {
    let link = '';
    let target = '';

    if (isBlockActive(editor, 'link')) {
      const [match] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) &&
          n.type === 'link',
      });
      link = match[0].url;
      target = match[0].target;
    }

    dispatch({
      link,
      target,
    });
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
              {
                'oak-active': isBlockActive(editor, 'link'),
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
