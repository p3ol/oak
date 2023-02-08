import { useReducer } from 'react';
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  TextField,
  Toggle,
  Tooltip,
  Label,
  classNames,
  exists,
  mockState,
} from '@junipero/react';
import { Text } from '@poool/oak';

import { schema } from '../schema';
import { getActiveAttrs } from '../utils';

export default ({
  className,
  state: prosemirrorState,
  onChange,
  active = false,
}) => {
  const [state, dispatch] = useReducer(mockState, {
    href: '',
    target: null,
  });

  const onClick = e => {
    e.preventDefault();
    const {
      href,
      target,
    } = getActiveAttrs(prosemirrorState, schema.marks.link);
    dispatch({ href, target });
  };

  const onChange_ = (name, field) => {
    dispatch({
      [name]: exists(field.checked)
        ? field.checked
          ? field.value
          : null
        : field.value,
    });
    onChange({
      ...state,
      [name]: exists(field.checked)
        ? field.checked
          ? field.value
          : null
        : field.value });
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
                  'oak-active': active,
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
          value={state.href}
          onChange={onChange_.bind(null, 'href')}
          className="oak-link-url"
        />
        <Toggle
          checked={state.target === '_blank'}
          onChange={onChange_.bind(null, 'target')}
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
