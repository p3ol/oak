import {
  classNames,
  ColorField,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Tooltip,
} from '@poool/junipero';
import { Text } from '@poool/oak';
import { useRef, useState } from 'react';

export default ({ className, onChange }) => {
  const colorFieldRef = useRef();
  const [color, setColor] = useState('#000000');

  const onChange_ = field => {
    onChange(field.value);
  };

  const onClick = () => {
    colorFieldRef.current?.dropdownRef.current?.open();
  };

  return (
    <Dropdown className="oak-color-field">
      <DropdownToggle tag="span">
        <Tooltip text={(
          <Text
            name="addons.richtextField.fields.editor.color"
            default="Color"
          />
        )}
        >
          <a
            href="#"
            onClick={onClick}
            className={classNames(
              'oak-toolbar-button',
              'oak-color-button',
              className,
            )}
          >
            <i className="oak-icons">
              format_color_text
            </i>
          </a>
        </Tooltip>
      </DropdownToggle>
      <DropdownMenu>
        <ColorField
          ref={colorFieldRef}
          onChange={onChange_}
          popperOptions={{
            strategy: 'relative',
            modifiers: [{
              name: 'offset',
              options: {
                offset: [0, -20],
              },
            }],
          }}
        />
      </DropdownMenu>
    </Dropdown>
  );
};
