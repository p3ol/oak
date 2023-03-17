import { useEffect, useReducer } from 'react';
import { useSlate } from 'slate-react';
import { Editor, Element, Transforms, Range } from 'slate';
import {
  TextField,
  Toggle,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Tooltip,
  Label,
  classNames,
  mockState,
  exists,
} from '@junipero/react';
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

  const onClick = e => {
    e.preventDefault();

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
      <DropdownToggle>
        <span>
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
                'oak-link-button',
                {
                  'oak-active': isBlockActive(editor, 'link'),
                },
                className,
              )}
            >
              <i className="oak-icons">
                link
              </i>
            </a>
          </Tooltip>
        </span>
      </DropdownToggle>
      <DropdownMenu className="oak-link-input">
        <Label>
          <Text
            name="addons.richtextField.fields.editor.link"
            default="Link"
          />
        </Label>
        <TextField
          value={state.link}
          onChange={onChange.bind(null, 'link')}
          className="oak-link-url"
        />
        <Toggle
          checked={state.target === '_blank'}
          onChange={onChange.bind(null, 'target')}
          value="_blank"
        >
          <Text
            name="addons.richtextField.fields.editor.blank"
            default="Open in a new window"
          />
        </Toggle>
      </DropdownMenu>
    </Dropdown>
  );
};
