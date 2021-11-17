import { classNames, Dropdown, DropdownMenu, DropdownToggle, mockState, TextField, ToggleField, Tooltip } from '@poool/junipero';
import { Text } from '@poool/oak';
import { useReducer } from 'react';

export default ({ className }) => {
  const [state, dispatch] = useReducer(mockState, {
    link: '',
    target: null,
  });

  const onClick = () => {

  };

  const onChange = () => {

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
              'oak-link-button',
              {
                'oak-active': false,
              },
              className,
            )}
          >
            <i className="oak-icons">
              link
            </i>
          </a>
        </Tooltip>
      </DropdownToggle>
      <DropdownMenu className="oak-link-input">
        <TextField
          placeholder={(
            <Text
              name="addons.richtextField.fields.editor.link"
              default="Link"
            />
          )}
          value={state.link}
          onChange={onChange.bind(null, 'link')}
          className="oak-link-url"
        />
        <ToggleField
          checkedLabel={(
            <Text
              name="addons.richtextField.fields.editor.blank"
              default="Open in a new window"
            />
          )}
          uncheckedLabel={(
            <Text
              name="addons.richtextField.fields.editor.blank"
              default="Open in a new window"
            />
          )}
          checked={state.target === '_blank'}
          onChange={onChange.bind(null, 'target')}
          value="_blank"
        />
      </DropdownMenu>
    </Dropdown>
  );
};
